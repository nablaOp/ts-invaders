import * as Constants from './Constants'
import type { GameState } from './Types'
import type { Point } from './Point'
import type { Shape } from './Shape'
import { renderGameObjectHitBox, transformPointForViewport, getColorByPosition } from './ViewportUtils'

export const CannonActor = {
    initAt(): Point {
        return {
            X: Constants.GAME_AREA_WIDTH / 2 - Constants.CANNON_WIDTH / 2, 
            Y: Constants.GAME_AREA_HEIGHT - Constants.CANNON_HEIGHT - 5
        }
    },

    update(gameState: GameState): void {
        if (gameState.leftArrowPressed) {
            moveCannonLeft(gameState)
        }
        if (gameState.rightArrowPressed) {
            moveCannonRight(gameState)
        }
    },

    render(gameState: GameState): void {
        const startPosition = transformPointForViewport(gameState, gameState.cannonPosition)
        const vShape = shape.map((v: Point) => transformPointForViewport(gameState, v))

        gameState.viewport.render(startPosition, vShape, getColorByPosition(gameState.cannonPosition))

        renderGameObjectHitBox(gameState, gameState.cannonPosition, Constants.CANNON_WIDTH, Constants.CANNON_HEIGHT)
    },

    getShape(): Shape {
        return shape
    }
}


const moveCannonRight = (gameState: GameState): void  => {
    if (gameState.cannonPosition.X >= Constants.GAME_AREA_WIDTH - Constants.CANNON_WIDTH) {
        gameState.cannonPosition = { 
            ...gameState.cannonPosition, 
            X: Constants.GAME_AREA_WIDTH - Constants.CANNON_WIDTH 
        }
        return
    }

    gameState.cannonPosition = {
        ... gameState.cannonPosition,
        X: gameState.cannonPosition.X + Constants.CANNON_SPEED
    }
}

const moveCannonLeft = (gameState: GameState): void  => {
    if (gameState.cannonPosition.X <= 0) {
        gameState.cannonPosition = { 
            ...gameState.cannonPosition, 
            X: 0 
        }
        return
    }

    gameState.cannonPosition = {
        ... gameState.cannonPosition,
        X: gameState.cannonPosition.X - Constants.CANNON_SPEED
    }
}

const shape: Shape = [
    {X: 6, Y: 0},
    {X: 7, Y: 0},
    {X: 7, Y: 1},
    {X: 8, Y: 1},
    {X: 8, Y: 3},
    {X: 12, Y: 3},
    {X: 12, Y: 4},
    {X: 13, Y: 4},
    {X: 13, Y: 7},
    {X: 0, Y: 7},
    {X: 0, Y: 4},
    {X: 1, Y: 4},
    {X: 1, Y: 3},
    {X: 5, Y: 3},
    {X: 5, Y: 2}, 
    {X: 5, Y: 1}, 
    {X: 6, Y: 1},
]
