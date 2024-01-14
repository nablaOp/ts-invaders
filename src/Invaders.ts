import type { Point } from './Point'
import type { GameState, Invader, LargeInvader, MediumInvader, SmallInvader, InvadersGrid } from './Types'
import * as Constants from './Constants'
import { renderGameObjectHitBox } from './ViewportUtils'

export const InvadersActor = {
    init(): InvadersGrid {
        const invadersGrid = Array<Array<LargeInvader | MediumInvader | SmallInvader | null>>(5)
            .fill(Array<LargeInvader | MediumInvader | SmallInvader | null>(Constants.INVADER_ROW_LENGTH).fill(null)) as InvadersGrid

        const verticalGap = Constants.INVADER_VERTICAL_GAP

        const firstPositionInRow = 
            (Constants.GAME_AREA_WIDTH - 
                (Constants.INVADER_WIDTH * Constants.INVADER_ROW_LENGTH + 
                    (Constants.INVADER_WIDTH / 2) * (Constants.INVADER_ROW_LENGTH - 1))) / 2
        let curY = Constants.INVADER_INITIAL_TOP

        for (let r = 0; r < 5; r++) {
            let curX = firstPositionInRow
            const spawner = 
                r < 2 
                    ? (p: Point) => spawnLargeInvaderAt(p) 
                    : r < 4 
                        ? (p: Point) => spawnMediumInvaderAt(p)
                        : (p: Point) => spawnSmallInvaderAt(p)

            let row = []
            for (let i = 0; i < Constants.INVADER_ROW_LENGTH; i++) {
                row.push(spawner({X: curX, Y: curY + r * (Constants.INVADER_HEIGHT + verticalGap)}))

                curX = curX + Constants.INVADER_WIDTH + Constants.INVADER_WIDTH / 2
            }
            invadersGrid[r] = row
        }

        return invadersGrid
    },

    update(gameState: GameState): void {
        const invadersGrid = gameState.invadersGrid

        let updateCancelled = false
        for (let r = 0; r < invadersGrid.length; r++) {
            const invaders = invadersGrid[r].filter(a => a != null)

            for (let i = 0; i < invaders.length; i++) {
                if (invaders[i]!.position.Y <= 0) {
                    updateCancelled = true
                    break
                }

            }

            if (updateCancelled) break
        }

        if (updateCancelled) return

        let minX = 1000 
        let maxX = -1 

        let invadersDirection = gameState.invadersDirection
        let directionChanged = false

        for (let r = 0; r < invadersGrid.length; r++) {
            const invaders = invadersGrid[r].filter(a => a != null)

            for (let i = 0; i < invaders.length; i++) {
                const position = invaders[i]!.position
                position.X += invadersDirection * Constants.INVADER_SPEED

                if (position.X < minX)
                minX = position.X

                if (position.X > maxX)
                maxX = position.X

                if (invadersDirection == 1) {
                    if (maxX + Constants.INVADER_WIDTH >= Constants.GAME_AREA_WIDTH) {
                        directionChanged = true 
                        break
                    }
                } else {
                    if (minX <= 0) {
                        directionChanged = true
                        break
                    }
                }
            }

            if (directionChanged) break
        }

        if (directionChanged){
            for (let r = 0; r < invadersGrid.length; r++) {
                const invaders = invadersGrid[r].filter(a => a != null)

                for (let i = 0; i < invaders.length; i++) {
                    invaders[i]!.position.Y += Constants.INVADER_VERTICAL_SPEED
                }
            }

            invadersDirection = -1 * invadersDirection

            directionChanged = false
        }

        gameState.invadersDirection = invadersDirection
        gameState.invadersGrid = invadersGrid
    },

    render(gameState: GameState): void {
        const invadersGrid = gameState.invadersGrid
        for (let r = 0; r < invadersGrid.length; r++) {
            const invaders = invadersGrid[r].filter(a => a != null)

            for (let i = 0; i < invaders.length; i++) {
                // const startPosition = this.transformPointForViewport(invaders[i]!.position)

                // const shapes = this.getLargeInvaderShape()
                // for (const shape of shapes) {
                //    const vShape = this.transformShapeForViewport(shape) 
                //     this.viewport.render(startPosition, vShape)
                // }

                renderGameObjectHitBox(
                    gameState, 
                    invaders[i]!.position, 
                    Constants.INVADER_WIDTH, 
                    Constants.INVADER_HEIGHT)
            }
        }
    },

    destroy(gameState: GameState, invader: [number, number]): void {
        const [r, i] = invader
        gameState.invadersGrid[r][i] = null
    }
}

const spawnLargeInvaderAt = (position: Point): LargeInvader => {
    return spawnInvaderAt<LargeInvader>(position, 1, 10)
}

const spawnMediumInvaderAt =(position: Point): MediumInvader => {
    return spawnInvaderAt<MediumInvader>(position, 1, 20)
}

const spawnSmallInvaderAt= (position: Point): SmallInvader => {
    return spawnInvaderAt<SmallInvader>(position, 1, 30)
}

const spawnInvaderAt = <T extends Invader>(position: Point, hitpoints: number, score: number): T  => {
    return { position, hitpoints, score } as T
}
