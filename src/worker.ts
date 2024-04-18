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

export default () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let points: Point[] = [];
  let x: number = 0;
  let y: number = 0;
  let isCaculate = false;
  onmessage = async (e) => {
    switch (e.data.method) {
      case "init":
        canvas = e.data.canvas;
        ctx = canvas.getContext("2d");
        x = e.data.x;
        y = e.data.y;
        draw();
        break;
      case "changePoints":
        changePoints(e.data.points);
        break;
      case "moveMouse":
        for (let i of points) {
          i.x = i.cx + e.data.x;
          i.y = i.cy + e.data.y;
        }
        break;
      default:
        break;
    }
  };
  // 改变点阵
  const changePoints = (newPoints: Point[]) => {
    // 首先打乱原来的点阵，避免有规律的运动打破粒子动画的随机性
    // 点数适配
    if (points.length >= newPoints.length) {
      points.sort(() => Math.random() - 0.5);
      points.splice(newPoints.length);
    } else {
      let len = newPoints.length - points.length;
      const { width, height } = canvas;
      for (let i = 0; i < len; i++) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          cx: 0,
          cy: 0,
          rgba: [0, 0, 0, 255],
        });
      }
      points.sort(() => Math.random() - 0.5);
    }
    // 赋值
    for (let i = 0; i < newPoints.length; i++) {
      points[i].cx = x + newPoints[i].x;
      points[i].cy = y + newPoints[i].y;
      points[i].rgba = newPoints[i].rgba;
    }
  };
  // 异步计算点位的改变
  const pointsMove = () => {
    isCaculate = true;
    return new Promise<void>((resolve) => {
      for (let i of points) {
        i.x = i.x + (i.cx - i.x) / 10;
        i.y = i.y + (i.cy - i.y) / 10;
      }
      isCaculate = false;
      resolve();
    });
  };
  const draw = () => {
    let a: ImageData, b: Uint8ClampedArray;
    // 异步计算，避免阻塞
    if (!isCaculate) {
      pointsMove();
    }
    if (ctx) {
      const { width, height } = canvas;
      b = (a = ctx.createImageData(width, height)).data;
      for (let i of points) {
        let tx = Math.floor(i.x),
          ty = Math.floor(i.y);
        let j = (tx + ty * width) * 4;
        b[j] = i.rgba[0];
        b[j + 1] = i.rgba[1];
        b[j + 2] = i.rgba[2];
        b[j + 3] = i.rgba[3];
      }
      ctx.putImageData(a, 0, 0);
    }
    requestAnimationFrame(draw);
  };
};