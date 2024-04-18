const defaultOptions = {
    x: 0,
    y: 0,
};
class MyCanvas {
    worker;
    x = 0;
    y = 0;
    constructor(canvasWorker, offscrean, options = {}) {
        options = { ...defaultOptions, ...options };
        // 配置显示区域
        this.x = options.x;
        this.y = options.y;
        this.worker = canvasWorker;
        this.worker.postMessage({
            method: "init",
            canvas: offscrean,
            x: this.x,
            y: this.y,
        }, [offscrean]);
    }
    // 修改图片
    changeImage(image) { }
    // 修改点
    changePoints(points) {
        this.worker.postMessage({ method: "changePoints", points });
    }
    // 移动鼠标
    moveMouse(x, y) {
        this.worker.postMessage({ method: "moveMouse", x, y });
    }
    end() {
        this.worker.terminate();
    }
}
import work from "./worker";
export const initCanvas = (canvas, options = {}) => {
    let offscrean = canvas.transferControlToOffscreen();
    let worker = new Worker(URL.createObjectURL(new Blob([`(${work.toString()})()`])));
    return new MyCanvas(worker, offscrean, options);
};
