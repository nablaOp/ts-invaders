import { Point } from './Point'
import type { GameState } from './Types'
import { gameOver } from './Types'
import * as Constants from './Constants'
import { transformPointForViewport, renderGameObjectHitBox } from './ViewportUtils'

export const StatusBarActor = {
    render(gameState: GameState): void {
        renderLives(gameState)
        renderScore(gameState)
    },

    renderGameOver(gameState: GameState): void {
        renderGameOver(gameState)
    }
}

const renderLives = (gameState: GameState): void => {
    const titlePos: Point = Constants.LIVES_TITLE_POSITION 
    gameState.viewport.renderText(transformPointForViewport(gameState, titlePos), Constants.LIVES_TEXT, 0)

    let position = Constants.LIVES_INITIAL_POSITION

    for (let i = 0; i < gameState.cannonHitpoints; i++) {
        // const startPosition = this.transformPointForViewport(position)
        // const shape = this.getCannonShape().map(v => this.transformPointForViewport(v))
        // this.viewport.render(startPosition, shape) 
        renderGameObjectHitBox(gameState, position, Constants.CANNON_WIDTH, Constants.CANNON_HEIGHT) 
        position =  { ...position, X: position.X + Constants.CANNON_WIDTH + 2 }
    }
}

const renderScore = (gameState: GameState): void => {
    const titlePos: Point = Constants.SCORE_TITLE_POSITION
    const scorePos: Point = Constants.SCORE_VALUE_POSITION 

    gameState.viewport.renderText(transformPointForViewport(gameState, titlePos), Constants.SCORE_TEXT, 0)
    gameState.viewport.renderText(transformPointForViewport(gameState, scorePos), gameState.score.toString(), 1) 
}

const renderGameOver = (gameState: GameState): void => {
    if (!gameOver(gameState)) return

    const pos: Point = Constants.GAME_OVER_POSITION 
    gameState.viewport.renderText(transformPointForViewport(gameState, pos), Constants.GAME_OVER_TEXT, 2)
}

