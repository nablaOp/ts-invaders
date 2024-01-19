import type { Point } from "./Point";
import type { Shape } from "./Shape";

export interface IViewport {
    render(pos: Point, shape: Shape, color: string): void
    renderPoint(pos: Point, color: string): void 
    renderBorder(pos: Point, shape: Shape): void
    renderText(pos: Point, text: string, style: number): void
    reset(): void
}
