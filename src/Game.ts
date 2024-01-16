import { gameOver, type GameState } from './Types'
import { IViewport } from './IViewport'
import * as Constants from './Constants'
import { CannonActor } from './Cannon'
import { CannonBulletActor } from './Bullet'
import { InvadersActor } from './Invaders'
import { UfoActor } from './Ufo'
import { InvaderBulletActor } from './InvaderBullet'
import { StatusBarActor } from './StatusBar'
import { CollisionResolver } from './CollisionResolver'

// TODO:
// - add invader animation
// - add defense
// - add ufo

export class Game {
    gameAreaViewportWidth: number
    gameAreaViewportHeight: number
    viewport : IViewport

    gameAreaWidth: number
    gameAreaHeight: number

    msPerFrame: number

    gameState: GameState

    public constructor(width: number, height: number , viewport: IViewport) {
        this.gameAreaViewportWidth = width
        this.gameAreaViewportHeight = height
        this.viewport = viewport

        this.gameAreaWidth = Constants.GAME_AREA_WIDTH
        this.gameAreaHeight = Constants.GAME_AREA_HEIGHT

        this.msPerFrame = 1000 / 60

        this.gameState = this.initGameState(viewport, width, height)
    }

    public start() : void {
        this.initKeymap()

        setInterval(async () => {
            this.update()
        }, this.msPerFrame)

        setInterval(async () => {
            this.render()
        }, this.msPerFrame)
    }

    initGameState(viewport: IViewport, width: number, height: number): GameState {
        return {
            viewport: viewport,
            viewportWidth: width,
            viewportHeight: height,
            score: 0,
            cannonPosition: CannonActor.initAt(),
            cannonHitpoints: 3,
            rightArrowPressed: false,
            leftArrowPressed: false,
            spacePressed: false,
            cannonBulletCounter: 0,
            cannonBulletCounterDirection: 1,
            cannonBulletPosition: CannonBulletActor.initAt(),
            invadersGrid: InvadersActor.init(),
            invadersSpeed: Constants.INVADER_SPEED,
            invadersDirection: 1,
            invaderBulletPosition: InvaderBulletActor.initAt(),
            ufoPosition: UfoActor.initAt()
        }
    }

    update(): void {
        if (gameOver(this.gameState)) return

        CannonActor.update(this.gameState)
        CannonBulletActor.update(this.gameState)
        InvadersActor.update(this.gameState)
        InvaderBulletActor.update(this.gameState)
        UfoActor.update(this.gameState)

        CollisionResolver.resolve(this.gameState)
    }
    
    render(): void {
        this.resetViewport()
        
        StatusBarActor.render(this.gameState)
        CannonActor.render(this.gameState)
        CannonBulletActor.render(this.gameState)
        InvadersActor.render(this.gameState)
        InvaderBulletActor.render(this.gameState)
        UfoActor.render(this.gameState)

        StatusBarActor.renderGameOver(this.gameState)
    }

    resetViewport(): void {
        this.viewport.reset()
    }

    // keymap
    
    initKeymap(): void {
        document.addEventListener('keydown', (e) => {
            switch (e.code) {
                case "ArrowRight": {
                    this.gameState = { ...this.gameState, rightArrowPressed: true }
                    break
                }
                case "ArrowLeft": {
                    this.gameState = { ...this.gameState, leftArrowPressed: true }
                    break
                }
                case "Space": {
                    this.gameState = { ... this.gameState, spacePressed: true }
                    break
                }
                default: {
                    break
                }
            }
        })

        document.addEventListener('keyup', (e) => {
            switch (e.code) {
                case "ArrowRight": {
                    this.gameState = { ...this.gameState, rightArrowPressed: false }
                    break
                }
                case "ArrowLeft": {
                    this.gameState = { ...this.gameState, leftArrowPressed: false }
                    break
                }
                case "Space": {
                    this.gameState = { ... this.gameState, spacePressed: false }
                    break
                }
                default: {
                    break
                }
            }
        })
    }
}

