import type { Point } from "./Point"
import type { GameState } from "./Types"
import { renderGameObjectHitBox } from "./ViewportUtils"
import * as Constants from './Constants'

export const CannonBulletActor = {
    initAt(): Point | null {
        return null 
    }, 

    update(gameState: GameState): void {
        if (gameState.cannonBulletPosition == null) {
            if (gameState.spacePressed) {
                spawnBullet(gameState)
            }

        } else {
            gameState.cannonBulletPosition = {
                ... gameState.cannonBulletPosition,
                Y: (gameState.cannonBulletPosition.Y - Constants.BULLET_MOVE_SPEED)
            }

            if (gameState.cannonBulletPosition.Y <= 0) {
                this.destroy(gameState)
            }
        }

    },

    destroy(gameState: GameState): void {
        gameState.cannonBulletPosition = null
    },

    render(gameState: GameState): void {
        if (gameState.cannonBulletPosition == null) return

        renderGameObjectHitBox(
            gameState,
            gameState.cannonBulletPosition,
            Constants.BULLET_WIDTH, 
            Constants.BULLET_HEIGHT)
    }
}

const spawnBullet = (gameState: GameState): void => {
    gameState.cannonBulletPosition = {
        X: gameState.cannonPosition.X + Constants.CANNON_WIDTH / 2,
        Y: gameState.cannonPosition.Y - Constants.BULLET_HEIGHT
    }
}
