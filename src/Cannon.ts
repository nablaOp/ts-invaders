import * as Constants from './Constants'
import type { GameState } from './Types'
import type { Point } from './Point'
import { renderGameObjectHitBox } from './ViewportUtils'

export interface IGameObjectActor {
    initAt(): Point,
    update(gameState: GameState): void
    render(gameState: GameState): void,
}

export const CannonActor: IGameObjectActor = {
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
        // const startPosition = transformPointForViewport(this.gameState.cannonPosition)
        // const shape = getCannonShape().map(v => this.transformPointForViewport(v))

        // viewport.render(startPosition, shape)

        renderGameObjectHitBox(gameState, gameState.cannonPosition, Constants.CANNON_WIDTH, Constants.CANNON_HEIGHT)
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

