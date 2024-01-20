import { BunkerPoint, BunkerPoints, BunkerRow, DefenseSystem, GameState, BunkerPointState, Bunker } from "./Types";
import * as Constants from './Constants'
import { Shape } from "./Shape";
import { getColorByPosition, renderGameObjectHitBox, transformPointForViewport } from "./ViewportUtils";
import { Point } from "./Point";

export const DefenseActor = {
    init() : DefenseSystem {
        const system: DefenseSystem = []
        const gap = Math.floor((Constants.GAME_AREA_WIDTH - 4 * Constants.BUNKER_WIDTH) / 5)
        let x = gap

        for (let i = 0; i < 4; i++) {
            system.push({
                position: {X: x, Y: Constants.DEFENSE_INITIAL_TOP},
                points: initBunkerPoints()
            })

            x += Constants.BUNKER_WIDTH + gap
        }

        return system
    },

    render(gameState: GameState): void {
        for (let i = 0; i < gameState.defenseSystem.length; i++) {
            const bunker = gameState.defenseSystem[i]
            for (let r = 0; r < bunker.points.length; r++) {
                const row = gameState.defenseSystem[i].points[r]
                for (let x = 0; x < row.length; x++) {
                    if (row[x].state != BunkerPointState.Default) continue

                    const point = {X: bunker.position.X + row[x].X, Y: bunker.position.Y + row[x].Y}
                    const vPoint = transformPointForViewport(gameState, point)
                    gameState.viewport.renderPoint(vPoint, getColorByPosition(vPoint))
                }
            }

            const startPosition = transformPointForViewport(gameState, gameState.defenseSystem[i].position)

            renderGameObjectHitBox(
                gameState,
                startPosition,
                Constants.BUNKER_WIDTH, 
                Constants.BUNKER_HEIGHT)
        }
    },

    updateByTopCollision(gameState: GameState, bunkerId: number, x: number): boolean {
        const bunker = gameState.defenseSystem[bunkerId]
        const hitX = Math.floor(x) - bunker.position.X
        let beingStuck = false
        
        let epicenter: Point = {X: 0, Y: 0}

        for (let r = 0; r < bunker.points.length; r++) {
            const row = bunker.points[r]

            if (!row[hitX] || row[hitX].state == BunkerPointState.Destroyed) continue

            epicenter = {X: hitX, Y: r}
            beingStuck = true
            break
        }

        if (beingStuck) {
            destroyPoints(bunker, epicenter)
        }

        return beingStuck
    },

    updateByCollision(gameState: GameState, bunkerId: number, x: number): boolean {
        const bunker = gameState.defenseSystem[bunkerId]
        const hitX = Math.floor(x) - bunker.position.X
        let beingStuck = false

        let epicenter: Point = {X: 0, Y: 0}
        
        for (let r = bunker.points.length - 1; r >= 0; r--) {
            const row = bunker.points[r]

            if (!row[hitX] || row[hitX].state == BunkerPointState.Destroyed) continue

            epicenter = {X: hitX, Y: r}
            beingStuck = true
            break
        }

        if (beingStuck) {
            destroyPoints(bunker, epicenter)
        }

        return beingStuck
    }
}

const destroyPoint = (bunker: Bunker, x: number, y: number): void => {
    if (bunker.points[y] && bunker.points[y][x]) {
        bunker.points[y][x].state = BunkerPointState.Destroyed
    }
}

const destroyPoints = (bunker: Bunker, epicenter: Point): void => {
    destroyPoint(bunker, epicenter.X, epicenter.Y)
    destroyPoint(bunker, epicenter.X + 1, epicenter.Y)
    destroyPoint(bunker, epicenter.X + 2, epicenter.Y)
    destroyPoint(bunker, epicenter.X - 1, epicenter.Y)
    destroyPoint(bunker, epicenter.X - 2, epicenter.Y)
    
    destroyPoint(bunker, epicenter.X, epicenter.Y + 1)
    destroyPoint(bunker, epicenter.X, epicenter.Y + 2)
    destroyPoint(bunker, epicenter.X, epicenter.Y - 1)
    destroyPoint(bunker, epicenter.X, epicenter.Y - 2)

    destroyPoint(bunker, epicenter.X + 1, epicenter.Y + 1)
    destroyPoint(bunker, epicenter.X + 1, epicenter.Y - 1)
    destroyPoint(bunker, epicenter.X - 1, epicenter.Y + 1)
    destroyPoint(bunker, epicenter.X - 1, epicenter.Y - 1)
}

const initBunkerPoints = (): BunkerPoints => {
    const points: BunkerPoints = new Array<BunkerRow>

    for (let i = 0; i < Constants.BUNKER_HEIGHT; i++) {
        const row: BunkerRow = new Array<BunkerPoint>

        for (let j = 0; j < Constants.BUNKER_WIDTH; j++) {
            const state = 
                unusedPoints.some(p => p.X == j && p.Y == i)
                    ? BunkerPointState.Unused
                    : BunkerPointState.Default

            row.push({X: j, Y: i, state: state})
        }

        points.push(row)
    }

    return points
}

const unusedPoints: Array<Point> = [
    {X: 0, Y: 0},
    {X: 0, Y: 1},
    {X: 0, Y: 2},
    {X: Constants.BUNKER_WIDTH - 3, Y: 0},
    {X: Constants.BUNKER_WIDTH - 2, Y: 1},
    {X: Constants.BUNKER_WIDTH - 1, Y: 2},
    {X: 1, Y: 0},
    {X: 1, Y: 1},
    {X: Constants.BUNKER_WIDTH - 2, Y: 0},
    {X: Constants.BUNKER_WIDTH - 1, Y: 1},
    {X: 2, Y: 0},
    {X: Constants.BUNKER_WIDTH - 1, Y: 0},
    {X: Constants.BUNKER_WIDTH / 2 - 3, Y: Constants.BUNKER_HEIGHT - 1},
    {X: Constants.BUNKER_WIDTH / 2 - 2, Y: Constants.BUNKER_HEIGHT - 1},
    {X: Constants.BUNKER_WIDTH / 2 - 1, Y: Constants.BUNKER_HEIGHT - 1},
    {X: Constants.BUNKER_WIDTH / 2, Y: Constants.BUNKER_HEIGHT - 1},
    {X: Constants.BUNKER_WIDTH / 2 + 1, Y: Constants.BUNKER_HEIGHT - 1},
    {X: Constants.BUNKER_WIDTH / 2 + 2, Y: Constants.BUNKER_HEIGHT - 1},
    {X: Constants.BUNKER_WIDTH / 2 + 3, Y: Constants.BUNKER_HEIGHT - 1},
    {X: Constants.BUNKER_WIDTH / 2 - 2, Y: Constants.BUNKER_HEIGHT - 2},
    {X: Constants.BUNKER_WIDTH / 2 - 1, Y: Constants.BUNKER_HEIGHT - 2},
    {X: Constants.BUNKER_WIDTH / 2, Y: Constants.BUNKER_HEIGHT - 2},
    {X: Constants.BUNKER_WIDTH / 2 + 1, Y: Constants.BUNKER_HEIGHT - 2},
    {X: Constants.BUNKER_WIDTH / 2 + 2, Y: Constants.BUNKER_HEIGHT - 2},
    {X: Constants.BUNKER_WIDTH / 2 - 1, Y: Constants.BUNKER_HEIGHT - 3},
    {X: Constants.BUNKER_WIDTH / 2, Y: Constants.BUNKER_HEIGHT - 3},
    {X: Constants.BUNKER_WIDTH / 2 + 1, Y: Constants.BUNKER_HEIGHT - 3},
]

