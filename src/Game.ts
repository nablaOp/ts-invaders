import type { Shape } from './Shape'
import { gameOver, type GameState } from './Types'
import { IViewport } from './IViewport'
import * as Constants from './Constants'
import { CannonActor } from './Cannon'
import { CannonBulletActor } from './Bullet'
import { InvadersActor } from './Invaders'
import { InvaderBulletActor } from './InvaderBullet'
import { StatusBarActor } from './StatusBar'
import { CollisionResolver } from './CollisionResolver'

// TODO:
// - adjust speed
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
            cannonBulletPosition: CannonBulletActor.initAt(),
            invadersGrid: InvadersActor.init(),
            invadersDirection: 1,
            invaderBulletPosition: InvaderBulletActor.initAt()
        }
    }

    update(): void {
        if (gameOver(this.gameState)) return

        CannonActor.update(this.gameState)
        CannonBulletActor.update(this.gameState)
        InvadersActor.update(this.gameState)
        InvaderBulletActor.update(this.gameState)

        CollisionResolver.resolve(this.gameState)
    }
    
    render(): void {
        this.resetViewport()
        
        StatusBarActor.render(this.gameState)
        CannonActor.render(this.gameState)
        CannonBulletActor.render(this.gameState)
        InvadersActor.render(this.gameState)
        InvaderBulletActor.render(this.gameState)

        StatusBarActor.renderGameOver(this.gameState)
    }

    resetViewport(): void {
        this.viewport.reset()
    }

    /// cannon shape
    
    getCannonShape(): Shape {
        return []
        const shape = []

        shape.push({X: 6, Y: 0})
        shape.push({X: 7, Y: 0})
        shape.push({X: 7, Y: 1})
        shape.push({X: 8, Y: 1})
        shape.push({X: 8, Y: 3})
        shape.push({X: 12, Y: 3})
        shape.push({X: 12, Y: 4})
        shape.push({X: 13, Y: 4})
        shape.push({X: 13, Y: 7})
        shape.push({X: 0, Y: 7})
        shape.push({X: 0, Y: 4})
        shape.push({X: 1, Y: 4})
        shape.push({X: 1, Y: 3})
        shape.push({X: 5, Y: 3})
        shape.push({X: 5, Y: 2}) 
        shape.push({X: 5, Y: 1}) 
        shape.push({X: 6, Y: 1})

        return shape
    }


    /// invader shape
    
    getLargeInvaderShape(): Array<Shape>{
        return []
        const shapes: Array<Shape> = []

        const top: Shape = []
        top.push({X: 4, Y: 0})
        top.push({X: 8, Y: 0})
        top.push({X: 8, Y: 1})
        top.push({X: 11, Y: 1})
        top.push({X: 11, Y: 2})
        top.push({X: 12, Y: 2})
        top.push({X: 12, Y: 3})
        top.push({X: 0, Y: 3})
        top.push({X: 0, Y: 2})
        top.push({X: 1, Y: 2})
        top.push({X: 1, Y: 1})
        top.push({X: 4, Y: 1})
        
        const leftEye: Shape = []
        leftEye.push({X: 0, Y: 3})
        leftEye.push({X: 3, Y: 3})
        leftEye.push({X: 3, Y: 4})
        leftEye.push({X: 0, Y: 4})

        const rightEye: Shape = []
        rightEye.push({X: 9, Y: 3})
        rightEye.push({X: 12, Y: 3})
        rightEye.push({X: 12, Y: 4})
        rightEye.push({X: 9, Y: 4})

        const middleEye: Shape = []
        middleEye.push({X: 5, Y: 3})
        middleEye.push({X: 7, Y: 3})
        middleEye.push({X: 7, Y: 4})
        middleEye.push({X: 5, Y: 4})

        const bottom: Shape = []
        bottom.push({X: 0, Y: 4})
        bottom.push({X: 12, Y: 4})
        bottom.push({X: 12, Y: 5})
        bottom.push({X: 0, Y: 5})

        const bottomLeft: Shape = []
        bottomLeft.push({X: 2, Y: 5})
        bottomLeft.push({X: 5, Y: 5})
        bottomLeft.push({X: 5, Y: 6})
        bottomLeft.push({X: 2, Y: 6})

        const bottomRight: Shape = []
        bottomRight.push({X: 7, Y: 5})
        bottomRight.push({X: 10, Y: 5})
        bottomRight.push({X: 10, Y: 6})
        bottomRight.push({X: 7, Y: 6})

        const jaw: Shape = []
        jaw.push({X: 5, Y: 6})
        jaw.push({X: 7, Y: 6})
        jaw.push({X: 7, Y: 7})
        jaw.push({X: 5, Y: 7})

        const leftLeg: Shape = []
        leftLeg.push({X: 1, Y: 6})
        leftLeg.push({X: 3, Y: 6})
        leftLeg.push({X: 3, Y: 7})
        leftLeg.push({X: 1, Y: 7})

        const leftLeg2: Shape = []
        leftLeg2.push({X: 2, Y: 7})
        leftLeg2.push({X: 4, Y: 7})
        leftLeg2.push({X: 4, Y: 8})
        leftLeg2.push({X: 2, Y: 8})

        const rightLeg: Shape = []
        rightLeg.push({X: 9, Y: 6})
        rightLeg.push({X: 11, Y: 6})
        rightLeg.push({X: 11, Y: 7})
        rightLeg.push({X: 9, Y: 7})

        const rightLeg2: Shape = []
        rightLeg2.push({X: 8, Y: 7})
        rightLeg2.push({X: 10, Y: 7})
        rightLeg2.push({X: 10, Y: 8})
        rightLeg2.push({X: 8, Y: 8})

        shapes.push(top)
        shapes.push(leftEye)
        shapes.push(rightEye)
        shapes.push(middleEye)
        shapes.push(bottom)
        shapes.push(bottomLeft)
        shapes.push(bottomRight)
        shapes.push(jaw)
        shapes.push(leftLeg)
        shapes.push(leftLeg2)
        shapes.push(rightLeg)
        shapes.push(rightLeg2)

        return shapes
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

