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
                    renderColoredPoints(gameState, startPosition, bangShape, BANG_SHAPE_WIDTH)
                } else {
                    for (const shape of largeInvaderShape) {
                        const vShape = transformShapeForViewport(gameState, shape) 
                        gameState.viewport.render(startPosition, vShape, getColorByPosition(invaders[i]!.position))
                    }
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
        // gameState.invadersGrid[r][i] = null
    },

    isActivateInvader(invader: OneOfInvaders): boolean {
        return invader != null && !isDestroyedInvader(invader)
    }
}

const isDestroyedInvader = (invader: OneOfInvaders): invader is DestroyedInvader => {
    return invader != null && (invader as Invader).score === undefined
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

const largeInvaderShape: Array<Shape> = [ 
    [
        {X: 4, Y: 0},
        {X: 8, Y: 0},
        {X: 8, Y: 1},
        {X: 11, Y: 1},
        {X: 11, Y: 2},
        {X: 12, Y: 2},
        {X: 12, Y: 3},
        {X: 0, Y: 3},
        {X: 0, Y: 2},
        {X: 1, Y: 2},
        {X: 1, Y: 1},
        {X: 4, Y: 1},
    ],    
    [
        {X: 0, Y: 3},
        {X: 3, Y: 3},
        {X: 3, Y: 4},
        {X: 0, Y: 4},
    ], [
        {X: 9, Y: 3},
        {X: 12, Y: 3},
        {X: 12, Y: 4},
        {X: 9, Y: 4},
    ],[
        {X: 5, Y: 3},
        {X: 7, Y: 3},
        {X: 7, Y: 4},
        {X: 5, Y: 4},
    ],[
        {X: 0, Y: 4},
        {X: 12, Y: 4},
        {X: 12, Y: 5},
        {X: 0, Y: 5},
    ],[
        {X: 2, Y: 5},
        {X: 5, Y: 5},
        {X: 5, Y: 6},
        {X: 2, Y: 6},
    ],[
        {X: 7, Y: 5},
        {X: 10, Y: 5},
        {X: 10, Y: 6},
        {X: 7, Y: 6},
    ],[
        {X: 5, Y: 6},
        {X: 7, Y: 6},
        {X: 7, Y: 7},
        {X: 5, Y: 7},
    ],[
        {X: 1, Y: 6},
        {X: 3, Y: 6},
        {X: 3, Y: 7},
        {X: 1, Y: 7},
    ],[
        {X: 2, Y: 7},
        {X: 4, Y: 7},
        {X: 4, Y: 8},
        {X: 2, Y: 8},
    ],[
        {X: 9, Y: 6},
        {X: 11, Y: 6},
        {X: 11, Y: 7},
        {X: 9, Y: 7},
    ],[
        {X: 8, Y: 7},
        {X: 10, Y: 7},
        {X: 10, Y: 8},
        {X: 8, Y: 8},
    ]
]

const BANG_SHAPE_WIDTH = 13
const BANG_SHAPE_HEIGHT = 13

const bangShape: Array<string> = [
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
]
