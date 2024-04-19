interface Point {
  // 当前位置
  x: number;
  y: number;
  // 原始位置
  cx: number;
  cy: number;
  // 记录颜色
  rgba: [number, number, number, number];
}

const defaultOptions = {
  x: 0,
  y: 0,
};

class MyCanvas {
  public worker: Worker;
  public x: number = 0;
  public y: number = 0;

  constructor(
    canvasWorker: Worker,
    offscrean: OffscreenCanvas,
    options: any = {}
  ) {
    options = { ...defaultOptions, ...options };
    // 配置显示区域
    this.x = options.x;
    this.y = options.y;
    this.worker = canvasWorker;
    this.worker.postMessage(
      {
        method: "init",
        canvas: offscrean,
        x: this.x,
        y: this.y,
      },
      [offscrean]
    );
  }
  // 修改图片
  changeImage(image: ImageData) {}
  // 修改点
  changePoints(
    points: {
      x: number;
      y: number;
      rgba: [number, number, number, number];
    }[]
  ) {
    this.worker.postMessage({ method: "changePoints", points });
  }
  // 移动鼠标
  moveMouse(x: number, y: number) {
    this.worker.postMessage({ method: "moveMouse", x, y });
  }
  endMoveMouse() {
    this.worker.postMessage({ method: "endMoveMouse" });
  }
  // 修改半径
  changeR(r: number) {
    this.worker.postMessage({ method: "changeR", r });
  }
  end() {
    this.worker.terminate();
  }
}

import work from "./worker";

export const initCanvas = (canvas: HTMLCanvasElement, options = {}) => {
  let offscrean = canvas.transferControlToOffscreen();
  let worker = new Worker(
    URL.createObjectURL(new Blob([`(${work.toString()})()`]))
  );
  return new MyCanvas(worker, offscrean, options);
};
