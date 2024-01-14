import type { Point } from "./Point"
import type { GameState } from "./Types"
import { renderGameObjectHitBox, transformPointForViewport } from "./ViewportUtils"
import * as Constants from './Constants'
import { Shape } from "./Shape"

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

        const startPosition = transformPointForViewport(gameState, gameState.cannonBulletPosition)
        const vShape = shape.map((v: Point) => transformPointForViewport(gameState, v))

        gameState.viewport.render(startPosition, vShape)

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

const shape: Shape = [
    {X: 0, Y: 0},
    {X: 1, Y: 0},
    {X: 1, Y: 4},
    {X: 0, Y: 4}
]
