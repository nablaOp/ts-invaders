import type { Point } from './Point'
import type { GameState } from './Types'
import * as Constants from './Constants'
import { InvadersActor } from './Invaders'
import { InvaderBulletActor } from './InvaderBullet'
import { CannonBulletActor } from './Bullet'

export const CollisionResolver = {
    resolve(gameState: GameState): void {
        resolveCannonBullet(gameState)
        resolveInvaderBullet(gameState)
    }
}

const resolveCannonBullet = (gameState: GameState): void => {
    if (gameState.cannonBulletPosition == null) return

    let invaderToDestroy : Array<[number, number]> = []

    let hasCollision = false
    for (let r = 0; r < gameState.invadersGrid.length; r++) {
        for (let j = 0; j < gameState.invadersGrid[r].length; j++) {
            if (gameState.invadersGrid[r][j] == null)
            continue

            hasCollision = checkCollision(
                gameState.cannonBulletPosition, 
                Constants.BULLET_WIDTH,
                Constants.BULLET_HEIGHT,
                gameState.invadersGrid[r][j]!.position,
                Constants.INVADER_WIDTH,
                Constants.INVADER_HEIGHT)


            if (hasCollision) {
                gameState.score += gameState.invadersGrid[r][j]!.score
                invaderToDestroy.push([r, j])
                CannonBulletActor.destroy(gameState)
                break
            }
        }

        if (hasCollision) break
    }

    for (let j = 0; j < invaderToDestroy.length; j++) {
        InvadersActor.destroy(gameState, invaderToDestroy[j])
    }
}

const resolveInvaderBullet = (gameState: GameState): void => {
    if (gameState.invaderBulletPosition == null) return 

    const hasCollision = checkCollision(
        gameState.cannonPosition,
        Constants.CANNON_WIDTH,
        Constants.CANNON_HEIGHT,
        gameState.invaderBulletPosition,
        Constants.INVADER_BULLET_WIDTH,
        Constants.INVADER_BULLET_HEIGHT)

    if (hasCollision) {
        gameState.cannonHitpoints -= 1
        InvaderBulletActor.destroy(gameState)
    }
}

const checkCollision = (p1: Point, width1: number, height1: number, p2: Point, width2: number, height2: number) => {
        const l1 = p1
        const l2 = {X: p1.X + width1, Y: p1.Y + height1}
        const r1 = p2
        const r2 = {X: p2.X + width2, Y: p2.Y + height2}

        return ((r1.X >= l1.X && r1.X <= l2.X && r1.Y >= l1.Y && r1.Y <= l2.Y) || 
            (l1.X >= r1.X && l1.X <= r2.X && l1.Y >= r1.Y && l1.Y <= r2.Y))
    }
