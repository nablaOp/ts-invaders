import type { Point } from './Point'
import type { Shape } from './Shape'
import type { GameState, Invader } from './Types'
import { IViewport } from './IViewport'
import * as Constants from './Constants'
import { CannonActor } from './Cannon'
import { InvadersActor } from './Invaders'

// TODO:
// - add top menu
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

    gameOver(): boolean { 
        return this.gameState.cannonHitpoints == 0 || 
            this.gameState.invadersGrid.every(r => r.every(i => i == null))
    }

    // render 
    
    render(): void {
        this.resetViewport()
        
        this.renderScore()
        this.renderLives()
        
        CannonActor.render(this.gameState)
        this.renderBullets()
        InvadersActor.render(this.gameState)
        this.renderInvaderBullets()

        this.renderGameOver()

        this.renderGameObjectHitBox(this.gameState.cannonPosition, Constants.CANNON_WIDTH, Constants.CANNON_HEIGHT)
    }

    renderLives(): void {
        const titlePos: Point = Constants.LIVES_TITLE_POSITION 
        this.viewport.renderText(this.transformPointForViewport(titlePos), Constants.LIVES_TEXT, 0)

        let position = Constants.LIVES_INITIAL_POSITION

        for (let i = 0; i < this.gameState.cannonHitpoints; i++) {
            // const startPosition = this.transformPointForViewport(position)
            // const shape = this.getCannonShape().map(v => this.transformPointForViewport(v))
            // this.viewport.render(startPosition, shape) 
            this.renderGameObjectHitBox(position, Constants.CANNON_WIDTH, Constants.CANNON_HEIGHT) 
            position =  { ...position, X: position.X + Constants.CANNON_WIDTH + 2 }
        }
    }

    renderScore(): void {
        const titlePos: Point = Constants.SCORE_TITLE_POSITION
        const scorePos: Point = Constants.SCORE_VALUE_POSITION 

        this.viewport.renderText(this.transformPointForViewport(titlePos), Constants.SCORE_TEXT, 0)
        this.viewport.renderText(this.transformPointForViewport(scorePos), this.gameState.score.toString(), 1) 
    }

    renderGameOver(): void {
        if (!this.gameOver()) return

        const pos: Point = Constants.GAME_OVER_POSITION 
        this.viewport.renderText(this.transformPointForViewport(pos), Constants.GAME_OVER_TEXT, 2)
    }

    resetViewport(): void {
        this.viewport.reset()
    }

    renderBullets(): void {
        for (let i = 0; i < this.gameState.bullets.length; i++) {
            this.renderGameObjectHitBox(
                this.gameState.bullets[i], 
                Constants.BULLET_WIDTH, 
                Constants.BULLET_HEIGHT)
        }
    }

    renderInvaderBullets(): void {
        for (let i = 0; i < this.gameState.invaderBullets.length; i++) {
            this.renderGameObjectHitBox(
                this.gameState.invaderBullets[i], 
                Constants.INVADER_BULLET_WIDTH,
                Constants.INVADER_BULLET_HEIGHT)
        }
    }

    renderGameObjectHitBox(position: Point, width: number, height: number): void {
        const vPosition = this.transformPointForViewport(position)
        const hitBox = this.buildHitBox(width, height)
        const vHitBox = this.transformShapeForViewport(hitBox)

        this.renderHitBox(vPosition, vHitBox)
    }

    renderHitBox(position: Point, shape: Shape): void {
        this.viewport.renderBorder(position, shape)
    }
    
    // game state
    
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
            bulletReady: false,
            bullets: [],
            invadersGrid: InvadersActor.init(),
            invadersDirection: 1,
            invaderBulletReady: false,
            invaderBullets: []
        }
    }

    update(): void {
        if (this.gameOver()) return

        CannonActor.update(this.gameState)

        this.shoot()
        this.updateBullets()
        InvadersActor.update(this.gameState)
        this.invaderShoot()
        this.updateInvaderBullets()
    }

    // viewport 
    
    transformXForViewport(x: number): number {
        return this.gameAreaViewportWidth * x / this.gameAreaWidth
    }

    transformYForViewport(y: number): number {
        return this.gameAreaViewportHeight * y / this.gameAreaHeight
    }

    transformPointForViewport(position: Point) : Point {
        return {X: this.transformXForViewport(position.X), Y: this.transformYForViewport(position.Y)}
    }

    buildHitBox(width: number, height: number): Shape {
        return [
            {X: 0, Y: 0},
            {X: width, Y: 0},
            {X: width, Y: height},
            {X: 0, Y: height}
        ]
    }

    transformShapeForViewport(shape: Shape): Shape {
        return shape.map(v => this.transformPointForViewport(v))
    }

    // collision

    checkCollision(p1: Point, width1: number, height1: number, p2: Point, width2: number, height2: number) {
        const l1 = p1
        const l2 = {X: p1.X + width1, Y: p1.Y + height1}
        const r1 = p2
        const r2 = {X: p2.X + width2, Y: p2.Y + height2}

        return ((r1.X >= l1.X && r1.X <= l2.X && r1.Y >= l1.Y && r1.Y <= l2.Y) || 
            (l1.X >= r1.X && l1.X <= r2.X && l1.Y >= r1.Y && l1.Y <= r2.Y))
    }

    // cannon bullets

    shoot(): void {
        if (this.gameState.bulletReady == false)
            return

        this.spawnBullet()
        this.gameState.bulletReady = false
    }
    
    spawnBullet(): void {
        const bullet = {
            X: this.gameState.cannonPosition.X + Constants.CANNON_WIDTH / 2,
            Y: this.gameState.cannonPosition.Y - Constants.BULLET_HEIGHT
        }

        this.gameState.bullets.push(bullet)
    }

    destroyBullet(idx: number): void {
        this.gameState.bullets = this.gameState.bullets.filter((_, i) => i != idx)
    }

    updateBullets(): void {
        let toDestroy = [] 
        let invaderToDestroy : Array<[number, number]> = []

        for (let i = 0; i < this.gameState.bullets.length; i++) {
            this.gameState.bullets[i] = {
                ... this.gameState.bullets[i],
                Y: (this.gameState.bullets[i].Y - Constants.BULLET_MOVE_SPEED)
            }

            if (this.gameState.bullets[i].Y <= 0) toDestroy.push(i)

            for (let r = 0; r < this.gameState.invadersGrid.length; r++) {
                for (let j = 0; j < this.gameState.invadersGrid[r].length; j++) {
                    if (this.gameState.invadersGrid[r][j] == null)
                        continue

                    const hasCollision = this.checkCollision(
                        this.gameState.bullets[i], 
                        Constants.BULLET_WIDTH,
                        Constants.BULLET_HEIGHT,
                        this.gameState.invadersGrid[r][j]!.position,
                        Constants.INVADER_WIDTH,
                        Constants.INVADER_HEIGHT)


                    if (hasCollision) {
                        toDestroy.push(i)
                        this.gameState.score += this.gameState.invadersGrid[r][j]!.score
                        invaderToDestroy.push([r, j])
                        break
                    }
                }
            }
        }

        for (let i = 0; i < toDestroy.length; i++) {
            this.destroyBullet(toDestroy[i])
        }

        for (let j = 0; j < invaderToDestroy.length; j++) {
            InvadersActor.destroy(this.gameState, invaderToDestroy[j])
        }
    }

    // invader bullets
    
    findInvadersReadyToShoot(): Array<[number, number]> {
        let result: Array<[number, number]> = []

        for (let r = 0; r < this.gameState.invadersGrid.length; r++) {
            const row = this.gameState.invadersGrid[r]

            for (let i = 0; i < row.length; i++) {
                if (row[i] == null) continue;

                if (r == this.gameState.invadersGrid.length - 1) {
                    result.push([r, i])
                }

                let hasFreePath = true;
                for (let pr = r + 1; pr < this.gameState.invadersGrid.length; pr++) {
                    if (this.gameState.invadersGrid[pr][i] != null) {
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

    getNextInvaderToShoot(): Invader | null {
        const readyToShoot = this.findInvadersReadyToShoot()

        if (readyToShoot.length == 0) return null

        const rnd = Math.floor(Math.random() * readyToShoot.length)
        const [r, i] = readyToShoot[rnd]

        return this.gameState.invadersGrid[r][i]
    }

    invaderShoot(): void {
        this.gameState.invaderBulletReady = this.gameState.invaderBullets.length == 0

        if (this.gameState.invaderBulletReady == false)
            return

        this.spawnInvaderBullet()
        this.gameState.invaderBulletReady = false
    }
    
    spawnInvaderBullet(): void {
        const shooter = this.getNextInvaderToShoot()

        if (shooter == null) return

        const bullet = {
            X: shooter.position.X + Constants.INVADER_WIDTH / 2,
            Y: shooter.position.Y + Constants.INVADER_BULLET_HEIGHT
        }

        this.gameState.invaderBullets.push(bullet)
    }

    destroyInvaderBullet(idx: number): void {
        this.gameState.invaderBullets = this.gameState.invaderBullets.filter((_, i) => i != idx)
    }

    updateInvaderBullets(): void {
        let toDestroy = [] 

        for (let i = 0; i < this.gameState.invaderBullets.length; i++) {
            this.gameState.invaderBullets[i] = {
                ... this.gameState.invaderBullets[i],
                Y: (this.gameState.invaderBullets[i].Y + Constants.INVADER_BULLET_MOVE_SPEED)
            }

            if (this.gameState.invaderBullets[i].Y >= this.gameAreaHeight) toDestroy.push(i)

            const cannon = this.gameState.cannonPosition
            const hasCollision = this.checkCollision(
               cannon,
               Constants.CANNON_WIDTH,
               Constants.CANNON_HEIGHT,
               this.gameState.invaderBullets[i],
               Constants.INVADER_BULLET_WIDTH,
               Constants.INVADER_BULLET_HEIGHT)

            if (hasCollision) {
                toDestroy.push(i)
                this.gameState.cannonHitpoints -= 1
            }
        }

        for (let i = 0; i < toDestroy.length; i++) {
            this.destroyInvaderBullet(toDestroy[i])
        }
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
                    if (this.gameState.bulletReady == false) {
                        this.gameState.bulletReady = true
                    }
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
                default: {
                    break
                }
            }
        })
    }
}

