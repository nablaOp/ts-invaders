import { Point } from "./Point"
import { GameState } from "./Types"
import * as Constants from "./Constants"
import { getColorByPosition, renderGameObjectHitBox, transformPointForViewport } from "./ViewportUtils"
import { Shape } from "./Shape"

export const UfoActor = {
    initAt(): Point | null {
        return null
    },

    update(gameState: GameState): void {
        if (gameState.ufoPosition == null) {
            spawnUfo(gameState)
        } else {
            gameState.ufoPosition = {
                ... gameState.ufoPosition,
                X: (gameState.ufoPosition.X + Constants.UFO_MOVE_SPEED)
            }

            if (gameState.ufoPosition.X - Constants.UFO_WIDTH >= Constants.GAME_AREA_WIDTH) {
                this.destroy(gameState)
            }
        }
    },

    destroy(gameState: GameState): void {
        gameState.ufoPosition = null 
    },

    render(gameState: GameState): void {
        if (gameState.ufoPosition == null) return 
        
        const startPosition = transformPointForViewport(gameState, gameState.ufoPosition)
        const vShape = shape.map((v: Point) => transformPointForViewport(gameState, v))

        gameState.viewport.render(startPosition, vShape, getColorByPosition(gameState.ufoPosition))

        renderGameObjectHitBox(
            gameState,
            gameState.ufoPosition, 
            Constants.UFO_WIDTH,
            Constants.UFO_HEIGHT)
    }
}

const spawnUfo = (gameState: GameState): void => {
    const rnd = Math.floor(Math.random() * Constants.UFO_SPAWN_FACTOR)

    if (rnd != Constants.UFO_SPAWN_FACTOR - 1) return 

    gameState.ufoPosition = {
        X: 0,
        Y: Constants.UFO_INIT_POSITION 
    }
}

const shape: Shape = [
    {X: 0, Y: 0},
    {X: 10, Y: 0},
    {X: 10, Y: 5},
    {X: 0, Y: 5}
]
