import type { Point } from './Point'
import type { GameState, Invader } from './Types'
import * as Constants from './Constants'
import { InvadersActor } from './Invaders'
import { InvaderBulletActor } from './InvaderBullet'
import { CannonBulletActor } from './Bullet'
import { UfoActor } from './Ufo'
import { DefenseActor } from './Defense'

export const CollisionResolver = {
    resolve(gameState: GameState): void {
        resolveCannonBulletWithBunker(gameState)
        resolveCannonBulletWithInvaders(gameState)
        resolveCannonBulletWithUfo(gameState)
        resolveInvaderBulletWithBunker(gameState)
        resolveInvaderBullet(gameState)
    }
}

const resolveInvaderBulletWithBunker = (gameState: GameState): void => {
    if (gameState.invaderBulletPosition == null) return

    for (let i = 0; i < gameState.defenseSystem.length; i++) {
        const hasCollision = checkCollision(
            gameState.invaderBulletPosition,
            Constants.INVADER_BULLET_WIDTH,
            Constants.INVADER_BULLET_HEIGHT,
            gameState.defenseSystem[i].position,
            Constants.BUNKER_WIDTH,
            Constants.BUNKER_HEIGHT)

        if (hasCollision) {
            if (DefenseActor.updateByTopCollision(gameState, i, gameState.invaderBulletPosition.X)) {
                InvaderBulletActor.destroy(gameState)
                break
            }
        }
    }
}

const resolveCannonBulletWithBunker = (gameState: GameState): void => {
    if (gameState.cannonBulletPosition == null) return

    for (let i = 0; i < gameState.defenseSystem.length; i++) {
        const hasCollision = checkCollision(
            gameState.cannonBulletPosition,
            Constants.BULLET_WIDTH,
            Constants.BULLET_HEIGHT,
            gameState.defenseSystem[i].position,
            Constants.BUNKER_WIDTH,
            Constants.BUNKER_HEIGHT)

        if (hasCollision) {
            if (DefenseActor.updateByCollision(gameState, i, gameState.cannonBulletPosition.X)) {
                CannonBulletActor.destroy(gameState)
                break
            }
        }
    }
}

const resolveCannonBulletWithUfo = (gameState: GameState): void => {
    if (gameState.cannonBulletPosition == null) return
    if (gameState.ufoPosition == null) return

    const hasCollision = checkCollision(
        gameState.cannonBulletPosition,
        Constants.BULLET_WIDTH,
        Constants.BULLET_HEIGHT,
        gameState.ufoPosition,
        Constants.UFO_WIDTH,
        Constants.UFO_HEIGHT)

    if (hasCollision) {
        gameState.score += Constants.UFO_SCORE[gameState.cannonBulletCounter] 
        CannonBulletActor.destroy(gameState)
        UfoActor.destroy(gameState)
    }
}

const resolveCannonBulletWithInvaders = (gameState: GameState): void => {
    if (gameState.cannonBulletPosition == null) return

    let invaderToDestroy: Array<[number, number]> = []

    let hasCollision = false
    for (let r = 0; r < gameState.invadersGrid.length; r++) {
        for (let j = 0; j < gameState.invadersGrid[r].length; j++) {
            if (!InvadersActor.isActivateInvader(gameState.invadersGrid[r][j])) continue

            const invader = gameState.invadersGrid[r][j] as Invader

            hasCollision = checkCollision(
                gameState.cannonBulletPosition, 
                Constants.BULLET_WIDTH,
                Constants.BULLET_HEIGHT,
                invader.position,
                Constants.INVADER_WIDTH,
                Constants.INVADER_HEIGHT)


            if (hasCollision) {
                gameState.score += invader.score
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

        return !(l2.X < r1.X || r2.X < l1.X || l2.Y < r1.Y || r2.Y < l1.Y)
    }
