import { Point } from './Point'
import { Shape } from './Shape'
import { 
    GameState, 
    Invader, 
    LargeInvader, 
    MediumInvader, 
    SmallInvader, 
    InvadersGrid, 
    DestroyedInvader, 
    OneOfInvaders 
} from './Types'
import * as Constants from './Constants'
import { 
    renderGameObjectHitBox, 
    transformPointForViewport, 
    transformShapeForViewport, 
    getColorByPosition,
    renderColoredPoints, 
} from './ViewportUtils'

export const InvadersActor = {
    init(): InvadersGrid {
        const invadersGrid = Array<Array<OneOfInvaders>>(5)
            .fill(Array<OneOfInvaders>(Constants.INVADER_ROW_LENGTH).fill(null)) as InvadersGrid

        const verticalGap = Constants.INVADER_VERTICAL_GAP

        const firstPositionInRow = 
            (Constants.GAME_AREA_WIDTH - 
                (Constants.INVADER_WIDTH * Constants.INVADER_ROW_LENGTH + 
                    (Constants.INVADER_WIDTH / 2) * (Constants.INVADER_ROW_LENGTH - 1))) / 2
        let curY = Constants.INVADER_INITIAL_TOP

        for (let r = 0; r < 5; r++) {
            let curX = firstPositionInRow
            const spawner = 
                r < 1
                    ? (p: Point) => spawnSmallInvaderAt(p) 
                    : r < 3
                        ? (p: Point) => spawnMediumInvaderAt(p)
                        : (p: Point) => spawnLargeInvaderAt(p)

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

        let minX = 1000 
        let maxX = -1 

        let invadersDirection = gameState.invadersDirection
        let directionChanged = false

        for (let r = 0; r < invadersGrid.length; r++) {
            for (let i = 0; i < invadersGrid[r].length; i++) {
                const invader = invadersGrid[r][i]

                if (invader === null) continue

                if (isDestroyedInvader(invader)) {
                    const dInvader = invader as DestroyedInvader
                    dInvader.tick += 1

                    if (dInvader.tick > 10) {
                        gameState.invadersGrid[r][i] = null
                    }

                    continue
                }

                invader.viewTick += 1
                if (invader.viewTick > 20) {
                    invader.viewIdx = invader.viewIdx == 0 ? 1 : 0
                    invader.viewTick = 0
                }

                const position = invader.position
                position.X += invadersDirection * gameState.invadersSpeed 

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

            gameState.invadersSpeed += Constants.INVADER_SPEED_ADD 
            invadersDirection = -1 * invadersDirection

            directionChanged = false
        }

        gameState.invadersDirection = invadersDirection
    },

    render(gameState: GameState): void {
        const invadersGrid = gameState.invadersGrid
        for (let r = 0; r < invadersGrid.length; r++) {
            const invaders = invadersGrid[r].filter(a => a != null)

            for (let i = 0; i < invaders.length; i++) {
                const invader = invaders[i]!
                const startPosition = transformPointForViewport(gameState, invader.position)

                if (isDestroyedInvader(invader)) {
                    renderColoredPoints(
                        gameState, 
                        startPosition, 
                        shapes.bangShape, 
                        BANG_SHAPE_WIDTH)
                } else {
                    renderColoredPoints(
                        gameState, 
                        startPosition,
                        shapes[invader.views[invader.viewIdx]],
                        invader.width)
                }

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
        gameState.invadersGrid[r][i] = { position: gameState.invadersGrid[r][i]?.position, tick: 0 } as DestroyedInvader
    },

    isActivateInvader(invader: OneOfInvaders): boolean {
        return invader != null && !isDestroyedInvader(invader)
    }
}

const isDestroyedInvader = (invader: OneOfInvaders): invader is DestroyedInvader => {
    return invader != null && (invader as Invader).score === undefined
}

const spawnLargeInvaderAt = (position: Point): LargeInvader => {
    return spawnInvaderAt<LargeInvader>(position, 1, 10, 12, ["largeShape_0", "largeShape_1"])
}

const spawnMediumInvaderAt =(position: Point): MediumInvader => {
    return spawnInvaderAt<MediumInvader>(position, 1, 20, 11, ["mediumShape_0", "mediumShape_1"])
}

const spawnSmallInvaderAt= (position: Point): SmallInvader => {
    return spawnInvaderAt<SmallInvader>(position, 1, 30, 11, ["mediumShape_0", "mediumShape_1"])
}

const spawnInvaderAt = <T extends Invader>(
    position: Point, 
    hitpoints: number, 
    score: number, 
    width: number,
    views: Array<string>): T  => {
    return { position, hitpoints, score, width, views, viewIdx: 0, viewTick: 0} as T
}

const BANG_SHAPE_WIDTH = 13

const shapes = {
    largeShape_0: [
        '', '', '', '', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '', '', '', '', 
        '', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '', 
        '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', 
        '#FFFFFF', '#FFFFFF', '#FFFFFF', '', '', '#FFFFFF', '#FFFFFF', '', '', '#FFFFFF', '#FFFFFF', '#FFFFFF', 
        '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', 
        '', '', '#FFFFFF', '#FFFFFF', '#FFFFFF', '', '', '#FFFFFF', '#FFFFFF', '#FFFFFF', '', '', 
        '', '#FFFFFF', '#FFFFFF', '', '', '#FFFFFF', '#FFFFFF', '', '', '#FFFFFF', '#FFFFFF', '', 
        '', '', '#FFFFFF', '#FFFFFF', '', '', '', '', '#FFFFFF', '#FFFFFF', '', ''
    ],

    largeShape_1: [
        '', '', '', '', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '', '', '', '', 
        '', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '', 
        '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', 
        '#FFFFFF', '#FFFFFF', '#FFFFFF', '', '', '#FFFFFF', '#FFFFFF', '', '', '#FFFFFF', '#FFFFFF', '#FFFFFF', 
        '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', 
        '', '', '', '#FFFFFF', '#FFFFFF', '', '', '#FFFFFF', '#FFFFFF', '', '', '', 
        '', '', '#FFFFFF', '#FFFFFF', '', '#FFFFFF', '#FFFFFF', '', '#FFFFFF', '#FFFFFF', '', '', 
        '#FFFFFF', '#FFFFFF', '', '', '', '', '', '', '', '', '#FFFFFF', '#FFFFFF'
    ],

    mediumShape_0: [
        '', '', '#FFFFFF', '', '', '', '', '', '#FFFFFF', '', '', 
        '', '', '', '#FFFFFF', '', '', '', '#FFFFFF', '', '', '', 
        '', '', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '', '', 
        '', '#FFFFFF', '#FFFFFF', '', '#FFFFFF', '#FFFFFF', '#FFFFFF', '', '#FFFFFF', '#FFFFFF', '', 
        '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', 
        '#FFFFFF', '', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '', '#FFFFFF', 
        '#FFFFFF', '', '#FFFFFF', '', '', '', '', '', '#FFFFFF', '', '#FFFFFF', 
        '', '', '', '#FFFFFF', '#FFFFFF', '', '#FFFFFF', '#FFFFFF', '', '', ''
    ],

    mediumShape_1: [
        '', '', '#FFFFFF', '', '', '', '', '', '#FFFFFF', '', '', 
        '#FFFFFF', '', '', '#FFFFFF', '', '', '', '#FFFFFF', '', '', '#FFFFFF', 
        '#FFFFFF', '', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '', '#FFFFFF', 
        '#FFFFFF', '#FFFFFF', '#FFFFFF', '', '#FFFFFF', '#FFFFFF', '#FFFFFF', '', '#FFFFFF', '#FFFFFF', '#FFFFFF', 
        '', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '', 
        '', '', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '', '', 
        '', '', '#FFFFFF', '', '', '', '', '', '#FFFFFF', '', '', 
        '', '#FFFFFF', '', '', '', '', '', '', '', '#FFFFFF', ''
    ],


    bangShape: [
        '', '', '', '', '', '', '#FFFFFF', '', '', '', '', '', '', 
        '', '', '#FFFFFF', '', '', '', '#FFFFFF', '', '', '', '', '', '', 
        '', '', '', '', '', '', '', '', '', '#FFFFFF', '', '', '', 
        '', '', '', '#FFFFFF', '', '', '', '', '', '#FFFFFF', '', '', '#FFFFFF', 
        '', '', '', '', '', '#FFFFFF', '', '', '#FFFFFF', '', '', '#FFFFFF', '', 
        '', '', '', '', '', '', '', '', '', '', '', '', '', 
        '#FFFFFF', '#FFFFFF', '', '#FFFFFF', '', '', '', '', '', '#FFFFFF', '', '#FFFFFF', '#FFFFFF', 
        '', '', '', '', '', '', '', '', '', '', '', '', '', 
        '', '#FFFFFF', '', '', '#FFFFFF', '', '', '#FFFFFF', '', '', '', '', '', 
        '#FFFFFF', '', '', '#FFFFFF', '', '', '', '', '', '#FFFFFF', '', '', '', 
        '', '', '', '#FFFFFF', '', '', '', '', '', '', '', '', '', 
        '', '', '', '', '', '', '#FFFFFF', '', '', '', '#FFFFFF', '', '', 
        '', '', '', '', '', '', '#FFFFFF', '', '', '', '', '', ''
    ],
}
