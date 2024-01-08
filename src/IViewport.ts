import type { Position } from "./Position";
import type { Shape } from "./Shape";

export interface IViewport {
    render(pos: Position, shape: Shape): void
    reset(): void
}
