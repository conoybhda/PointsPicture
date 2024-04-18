"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCanvas = void 0;
const defaultOptions = {
    x: 0,
    y: 0,
};
class MyCanvas {
    constructor(canvasWorker, offscrean, options = {}) {
        this.x = 0;
        this.y = 0;
        options = Object.assign(Object.assign({}, defaultOptions), options);
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
const worker_1 = __importDefault(require("./worker"));
const initCanvas = (canvas, options = {}) => {
    let offscrean = canvas.transferControlToOffscreen();
    let worker = new Worker(URL.createObjectURL(new Blob([`(${worker_1.default.toString()})()`])));
    return new MyCanvas(worker, offscrean, options);
};
exports.initCanvas = initCanvas;
