import { Point } from './Point'
import { GameState, Invader } from './Types'
import * as Constants from './Constants'
import { renderGameObjectHitBox, transformPointForViewport } from './ViewportUtils'
import { Shape } from './Shape'

export const InvaderBulletActor = {
    initAt(): Point | null {
        return null
    },

    update(gameState: GameState): void {
        if (gameState.invaderBulletPosition == null) {
            spawnInvaderBullet(gameState)
        } else {
            gameState.invaderBulletPosition = {
                ... gameState.invaderBulletPosition,
                Y: (gameState.invaderBulletPosition.Y + Constants.INVADER_BULLET_MOVE_SPEED)
            }

            if (gameState.invaderBulletPosition.Y >= Constants.GAME_AREA_HEIGHT) {
                this.destroy(gameState)
            }
        }
    },

    destroy(gameState: GameState): void {
        gameState.invaderBulletPosition = null 
    },

    render(gameState: GameState): void {
        if (gameState.invaderBulletPosition == null) return 
        
        const startPosition = transformPointForViewport(gameState, gameState.invaderBulletPosition)
        const vShape = shape.map((v: Point) => transformPointForViewport(gameState, v))

        gameState.viewport.render(startPosition, vShape)

        renderGameObjectHitBox(
            gameState,
            gameState.invaderBulletPosition, 
            Constants.INVADER_BULLET_WIDTH,
            Constants.INVADER_BULLET_HEIGHT)
    }
}

const findInvadersReadyToShoot = (gameState: GameState): Array<[number, number]> => {
    let result: Array<[number, number]> = []

    for (let r = 0; r < gameState.invadersGrid.length; r++) {
        const row = gameState.invadersGrid[r]

        for (let i = 0; i < row.length; i++) {
            if (row[i] == null) continue;

            if (r == gameState.invadersGrid.length - 1) {
                result.push([r, i])
            }

            let hasFreePath = true;
            for (let pr = r + 1; pr < gameState.invadersGrid.length; pr++) {
                if (gameState.invadersGrid[pr][i] != null) {
                    hasFreePath = false
                    break
                }
            }

            if (hasFreePath) {
                result.push([r, i])
            }
        }
    }

    return result
}

const getNextInvaderToShoot = (gameState: GameState): Invader | null => {
    const readyToShoot = findInvadersReadyToShoot(gameState)

    if (readyToShoot.length == 0) return null

    const rnd = Math.floor(Math.random() * readyToShoot.length)
    const [r, i] = readyToShoot[rnd]

    return gameState.invadersGrid[r][i]
}


const spawnInvaderBullet = (gameState: GameState): void => {
    const shooter = getNextInvaderToShoot(gameState)

    if (shooter == null) return

    gameState.invaderBulletPosition = {
        X: shooter.position.X + Constants.INVADER_WIDTH / 2,
        Y: shooter.position.Y + Constants.INVADER_BULLET_HEIGHT
    }
}

const shape: Shape = [
    {X: 0, Y: 0},
    {X: 1, Y: 0},
    {X: 1, Y: 4},
    {X: 0, Y: 4}
]
