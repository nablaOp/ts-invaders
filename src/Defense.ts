import { BunkerPoint, BunkerPoints, BunkerRow, DefenseSystem, GameState, BunkerPointState } from "./Types";
import * as Constants from './Constants'
import { Shape } from "./Shape";
import { getColorByPosition, renderGameObjectHitBox, transformPointForViewport } from "./ViewportUtils";
import { Point } from "./Point";

export const DefenseActor = {
    init() : DefenseSystem {
        const system: DefenseSystem = []
        const gap = (Constants.GAME_AREA_WIDTH - 4 * Constants.DEFENSE_WIDTH) / 5
        let x = gap

        for (let i = 0; i < 4; i++) {
            system.push({
                position: {X: x, Y: Constants.DEFENSE_INITIAL_TOP},
                points: initBunkerPoints()
            })

            x += Constants.DEFENSE_WIDTH + gap
        }

        return system
    },

    render(gameState: GameState): void {
        for (let i = 0; i < gameState.defenseSystem.length; i++) {
            const startPosition = transformPointForViewport(gameState, gameState.defenseSystem[i].position)
            const vShape = shape.map((v: Point) => transformPointForViewport(gameState, v))

            gameState.viewport.render(startPosition, vShape, getColorByPosition(startPosition))

            renderGameObjectHitBox(
                gameState,
                startPosition,
                Constants.DEFENSE_WIDTH, 
                Constants.DEFENSE_HEIGHT)
        }
    }
}

const initBunkerPoints = (): BunkerPoints => {
    const points: BunkerPoints = new Array<BunkerRow>

    for (let i = 0; i < Constants.DEFENSE_WIDTH; i++) {
        const row: BunkerRow = new Array<BunkerPoint>

        for (let j = 0; j < Constants.DEFENSE_HEIGHT; j++) {
            row.push({X: i, Y: j, state: BunkerPointState.Default})
        }

        points.push(row)
    }

    return points
}

const shape: Shape = [
    {X: 0, Y: 0},
    {X: Constants.DEFENSE_WIDTH, Y: 0},
    {X: Constants.DEFENSE_WIDTH, Y: Constants.DEFENSE_HEIGHT},
    {X: 0, Y: Constants.DEFENSE_HEIGHT}
]
