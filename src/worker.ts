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
        mouse.isMove = true;
        mouse.x = e.data.x;
        mouse.y = e.data.y;
        break;
      case "endMoveMouse":
        mouse.isMove = false;
        break;
      case "changeWeight":
        weight = e.data.weight;
        break;
      case "changeMethod":
        moveMethod =
          caculatePoints[e.data.moveMethod as keyof typeof caculatePoints];
        break;
      case "loadImg":
        loadImg(e.data.url);
        break;
      default:
        break;
    }
  };
  // 加载图片
  const loadImg = async (url: string | URL) => {
    try {
      const res = await fetch(url);
      if (
        !res ||
        res.status !== 200 ||
        !res.headers?.get("Content-type")?.match(/image/)
      ) {
        console.error("图片加载失败");
        return res;
      }
      const blob = await res.blob();
      const bitmap = await createImageBitmap(blob);
      const offscrean = new OffscreenCanvas(800, 300);
      const ctx = offscrean.getContext("2d");
      if (!ctx) {
        console.error("获取offscrean失败");
        return;
      }
      (ctx as OffscreenCanvasRenderingContext2D).drawImage(bitmap, 0, 0);
      const imageData = (ctx as OffscreenCanvasRenderingContext2D).getImageData(
        0,
        0,
        800,
        300
      );
      bitmap.close();
      // 计算点阵
      let points: {
        x: number;
        y: number;
        rgba: [number, number, number, number];
      }[] = [];
      let index = 0;
      for (let i = 0; i < imageData.width; i += 3) {
        for (let j = 0; j < imageData.height; j += 3) {
          index = (i * imageData.width + j) * 4;
          if (imageData.data[index + 3] > 0) {
            points.push({
              x: i,
              y: j,
              rgba: [
                imageData.data[index],
                imageData.data[index + 1],
                imageData.data[index + 2],
                imageData.data[index + 3],
              ],
            });
          }
        }
      }
      console.log(points);
      changePoints(points);
      return imageData;
    } catch (e) {
      console.log(e);
    }
  };
  // 改变点阵
  const changePoints = (
    newPoints: {
      x: number;
      y: number;
      rgba: [number, number, number, number];
    }[]
  ) => {
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
  // 由鼠标位置计算点位的改变函数
  const caculatePoints = {
    // 排斥效果
    push: () => {
      for (let i of points) {
        let q = Math.atan2(i.cy - mouse.y, i.cx - mouse.x);
        let r = Math.hypot(i.cx - mouse.x, i.cy - mouse.y) + weight / 50;
        i.x = i.x + (i.cx + (weight / r) * Math.cos(q) - i.x) / 10;
        i.y = i.y + (i.cy + (weight / r) * Math.sin(q) - i.y) / 10;
      }
    },
    // 吸附效果
    pull: () => {
      for (let i of points) {
        let q = Math.atan2(i.cy - mouse.y, i.cx - mouse.x);
        let r = Math.hypot(i.cx - mouse.x, i.cy - mouse.y);
        if (r < 100) {
          i.x = i.x + (mouse.x - i.x) / 10;
          i.y = i.y + (mouse.y - i.y) / 10;
        } else {
          i.x = i.x + (i.cx - ((weight * 3) / r) * Math.cos(q) - i.x) / 10;
          i.y = i.y + (i.cy - ((weight * 3) / r) * Math.sin(q) - i.y) / 10;
        }
      }
    },
  };
  // 异步计算点位的改变
  const pointsMove = () => {
    isCaculate = true;
    setTimeout(() => {
      let d: number;
      if (mouse.isMove) {
        moveMethod();
      } else {
        for (let i of points) {
          i.x = i.x + (i.cx - i.x) / 10;
          i.y = i.y + (i.cy - i.y) / 10;
        }
      }

      isCaculate = false;
    }, 0);
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
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let points: Point[] = [];
  let x: number = 0;
  let y: number = 0;
  let isCaculate = false;
  let mouse = { isMove: false, x: 0, y: 0 };
  let moveMethod: Function = caculatePoints.push;
  let weight: number = 2500;
};
