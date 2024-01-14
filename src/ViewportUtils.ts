import type { Shape } from './Shape'
import type { Point } from './Point'
import type { GameState } from './Types'
import * as Constants from './Constants'

export const transformXForViewport = (gameState: GameState, x: number): number => {
    return gameState.viewportWidth * x / Constants.GAME_AREA_WIDTH
}

export const transformYForViewport = (gameState: GameState, y: number): number => {
    return gameState.viewportHeight * y / Constants.GAME_AREA_HEIGHT
}

export const transformPointForViewport = (gameState: GameState, position: Point) : Point => {
    return {X: transformXForViewport(gameState, position.X), Y: transformYForViewport(gameState, position.Y)}
}

export const transformShapeForViewport = (gameState: GameState, shape: Shape): Shape => {
    return shape.map(v => transformPointForViewport(gameState, v))
}

export const renderGameObjectHitBox = (gameState: GameState, position: Point, width: number, height: number): void => {
    const vPosition = transformPointForViewport(gameState, position)
    const hitBox = buildHitBox(width, height)
    const vHitBox = transformShapeForViewport(gameState, hitBox)

    renderHitBox(gameState, vPosition, vHitBox)
}

const buildHitBox = (width: number, height: number): Shape => {
        return [
            {X: 0, Y: 0},
            {X: width, Y: 0},
            {X: width, Y: height},
            {X: 0, Y: height}
        ]
    }

const renderHitBox = (gameState: GameState, position: Point, shape: Shape): void => {
    gameState.viewport.renderBorder(position, shape)
}
