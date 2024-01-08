import { Position } from './Position';
import { Shape } from './Shape';
import { IViewport } from './IViewport'

export class CanvasViewport implements IViewport {
    private canvasContext: CanvasRenderingContext2D

    constructor(canvasContext: CanvasRenderingContext2D) {
        this.canvasContext = canvasContext
    }

    public render(pos: Position, shape: Shape): void {
        const getX = (idx: number) => pos.X + shape[idx].X;
        const getY = (idx: number) => pos.Y + shape[idx].Y;

        this.canvasContext.beginPath()
        for (let i = 0; i < shape.length; i++){
            if (i == 0){
                this.canvasContext.moveTo(getX(i), getY(i))
                continue
            }

            this.canvasContext.lineTo(getX(i), getY(i))
        }

        this.canvasContext.lineTo(getX(0), getY(0))
        this.canvasContext.fillStyle = "white"
        this.canvasContext.fill()
    }

    public reset(): void {
        this.canvasContext.reset()
    }
}

