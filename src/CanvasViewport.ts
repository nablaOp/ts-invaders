import { Point } from './Point';
import { Shape } from './Shape';
import { IViewport } from './IViewport'

export class CanvasViewport implements IViewport {
    private canvasContext: CanvasRenderingContext2D

    constructor(canvasContext: CanvasRenderingContext2D) {
        this.canvasContext = canvasContext
    }

    public renderBorder(pos: Point, shape: Shape): void {
        this.renderInternal(pos, shape)
        this.canvasContext.strokeStyle = "yellow"
        this.canvasContext.stroke()
    }

    public render(pos: Point, shape: Shape, color: string): void {
        this.renderInternal(pos, shape)
        this.canvasContext.fillStyle = color
        this.canvasContext.fill()
    }

    private renderInternal(pos: Point, shape: Shape): void {
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
    }

    public renderText(pos: Point, text: string, style: number): void {
        this.setStyle(style)
        this.canvasContext.fillText(text, pos.X, pos.Y)
    }

    public reset(): void {
        this.canvasContext.reset()
    }

    private setStyle(style: number): void {
        this.canvasContext.font = '12pt Courier Regular'
        switch (style) {
            case 2: {
                this.canvasContext.font = '30pt Courier Regular'
                this.canvasContext.fillStyle = "green"
                break
            }
            case 1: { 
                this.canvasContext.fillStyle = "green"
                break
            }
            default: {
                this.canvasContext.fillStyle = "white"
                break
            }
        }
    }
}

