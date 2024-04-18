declare class MyCanvas {
    worker: Worker;
    x: number;
    y: number;
    constructor(canvasWorker: Worker, offscrean: OffscreenCanvas, options?: any);
    changeImage(image: ImageData): void;
    changePoints(points: {
        x: number;
        y: number;
        rgba: [number, number, number, number];
    }[]): void;
    moveMouse(x: number, y: number): void;
    end(): void;
}
export declare const initCanvas: (canvas: HTMLCanvasElement, options?: {}) => MyCanvas;
export {};
//# sourceMappingURL=index.d.ts.map