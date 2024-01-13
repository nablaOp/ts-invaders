import type { Point } from './Point'
import type { Shape } from './Shape'
import { IViewport } from './IViewport'

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

        this.gameAreaWidth = 100
        this.gameAreaHeight = 100

        this.msPerFrame = 1000 / 60

        this.gameState = this.initGameState()
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

    // render 
    
    render(): void {
        this.resetViewport()
        this.renderCannon()
        this.renderBullets()
        this.renderInvaders()
        this.renderInvaderBullets()
    }
    
    resetViewport(): void {
        this.viewport.reset()
    }

    renderCannon(): void {
        this.renderGameObject(this.gameState.cannonPosition, this.cannonWidth, this.cannonHeight)
    }

    renderBullets(): void {
        for (let i = 0; i < this.gameState.bullets.length; i++) {
            this.renderGameObject(
                this.gameState.bullets[i], 
                this.bulletWidth, 
                this.bulletHeight)
        }
    }

    renderInvaderBullets(): void {
        for (let i = 0; i < this.gameState.invaderBullets.length; i++) {
            this.renderGameObject(
                this.gameState.invaderBullets[i], 
                this.invaderBulletWidth,
                this.invaderBulletHeight)
        }
    }

    renderGameObject(position: Point, width: number, height: number): void {
        this.renderShape(
            this.adjustPositionToViewport(position),
            this.buildShapeToViewport(width, height))
    }

    renderShape(position: Point, shape : Shape) : void {
        this.viewport.render(position, shape)
    }
    
    // game state
    
    initGameState() : GameState {
        return {
            cannonPosition: this.initCannon(),
            rightArrowPressed: false,
            leftArrowPressed: false,
            bulletReady: false,
            bullets: [],
            invadersGrid: this.initInvaders(),
            invadersDirection: 1,
            invaderBulletReady: false,
            invaderBullets: []
        }
    }

    update(): void {
        if (this.gameState.rightArrowPressed) this.moveCannonRight()
        if (this.gameState.leftArrowPressed) this.moveCannonLeft()
        this.shoot()
        this.updateBullets()
        this.updateInvaders()
        this.invaderShoot()
        this.updateInvaderBullets()
    }

    // viewport 
    
    adjustXToViewport(x: number): number {
        return this.gameAreaViewportWidth * x / this.gameAreaWidth
    }

    adjustYToViewport(y: number): number {
        return this.gameAreaViewportHeight * y / this.gameAreaHeight
    }

    adjustPositionToViewport(position: Point) : Point {
        return {X: this.adjustXToViewport(position.X), Y: this.adjustYToViewport(position.Y)}
    }

    buildShapeToViewport(objWidth: number, objHeight: number): Shape {
        return [
            this.adjustPositionToViewport({X: 0, Y: 0}),
            this.adjustPositionToViewport({X: objWidth, Y: 0}),
            this.adjustPositionToViewport({X: objWidth, Y: objHeight}),
            this.adjustPositionToViewport({X: 0, Y: objHeight})
        ]
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

    // cannon
    
    readonly cannonWidth = 10
    readonly cannonHeight = 5
    readonly cannonSpeed = 0.5

    initCannon() : Point {
        return {
            X: this.gameAreaWidth / 2 - this.cannonWidth / 2, 
            Y: this.gameAreaHeight - this.cannonHeight
        }
    }

    moveCannonRight() : void {
        if (this.gameState.cannonPosition.X >= this.gameAreaWidth - this.cannonWidth) {
            this.gameState.cannonPosition = { 
                ...this.gameState.cannonPosition, 
                X: this.gameAreaWidth - this.cannonWidth 
            }
            return
        }

        this.gameState.cannonPosition = {
            ... this.gameState.cannonPosition,
            X: this.gameState.cannonPosition.X + this.cannonSpeed
        }
    }

    moveCannonLeft() : void {
        if (this.gameState.cannonPosition.X <= 0) {
            this.gameState.cannonPosition = { 
                ...this.gameState.cannonPosition, 
                X: 0 
            }
            return
        }

        this.gameState.cannonPosition = {
            ... this.gameState.cannonPosition,
            X: this.gameState.cannonPosition.X - this.cannonSpeed
        }
    }


    // cannon bullets

    readonly bulletWidth = 1 
    readonly bulletHeight = 2
    readonly bulletMoveSpeed = 0.5

    shoot(): void {
        if (this.gameState.bulletReady == false)
            return

        this.spawnBullet()
        this.gameState.bulletReady = false
    }
    
    spawnBullet(): void {
        const bullet = {
            X: this.gameState.cannonPosition.X + this.cannonWidth / 2,
            Y: this.gameState.cannonPosition.Y - this.bulletHeight
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
                Y: (this.gameState.bullets[i].Y - this.bulletMoveSpeed)
            }

            if (this.gameState.bullets[i].Y <= 0) toDestroy.push(i)

            for (let r = 0; r < this.gameState.invadersGrid.length; r++) {
                const activeInvaders = this.gameState.invadersGrid[r].filter(a => a != null)
                for (let j = 0; j < activeInvaders.length; j++) {
                const hasCollision = this.checkCollision(
                    this.gameState.bullets[i], 
                    this.bulletWidth,
                    this.bulletHeight,
                    activeInvaders[j]!.position,
                    this.invaderWidth,
                    this.invaderHeight)

     
                if (hasCollision) {
                    toDestroy.push(i)
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
            this.destroyInvader(invaderToDestroy[j])
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

    readonly invaderBulletWidth = 1 
    readonly invaderBulletHeight = 2
    readonly invaderBulletMoveSpeed = 0.5

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
            X: shooter.position.X + this.invaderWidth / 2,
            Y: shooter.position.Y + this.invaderBulletHeight
        }

        this.gameState.invaderBullets.push(bullet)
    }

    destroyInvaderBullet(idx: number): void {
        this.gameState.invaderBullets = this.gameState.invaderBullets.filter((_, i) => i != idx)
    }

    updateInvaderBullets(): void {
        let toDestroy = [] 
        // let invaderToDestroy : Array<[number, number]> = []

        for (let i = 0; i < this.gameState.invaderBullets.length; i++) {
            this.gameState.invaderBullets[i] = {
                ... this.gameState.invaderBullets[i],
                Y: (this.gameState.invaderBullets[i].Y + this.invaderBulletMoveSpeed)
            }

            if (this.gameState.invaderBullets[i].Y >= this.gameAreaHeight) toDestroy.push(i)

     //        for (let r = 0; r < this.gameState.invadersGrid.length; r++) {
     //            const activeInvaders = this.gameState.invadersGrid[r].filter(a => a != null)
     //            for (let j = 0; j < activeInvaders.length; j++) {
     //            const hasCollision = this.checkCollision(
     //                this.gameState.bullets[i], 
     //                this.bulletWidth,
     //                this.bulletHeight,
     //                activeInvaders[j]!.position,
     //                this.invaderWidth,
     //                this.invaderHeight)
     //
     // 
     //            if (hasCollision) {
     //                toDestroy.push(i)
     //                invaderToDestroy.push([r, j])
     //                break
     //            }
     //        }
     //        }
        }

        for (let i = 0; i < toDestroy.length; i++) {
            this.destroyInvaderBullet(toDestroy[i])
        }

        // for (let j = 0; j < invaderToDestroy.length; j++) {
        //     this.destroyInvader(invaderToDestroy[j])
        // }
    }

    // invaders

    readonly invaderWidth = 5
    readonly invaderHeight = 5
    readonly invaderSpeed = 0.1
    readonly invaderVerticalSpeed = 5
    readonly invaderRowLength = 11

    spawnLargeInvaderAt(position: Point): LargeInvader {
        return this.spawnInvaderAt<LargeInvader>(position, 1, 10)
    }

    spawnMediumInvaderAt(position: Point): MediumInvader {
        return this.spawnInvaderAt<MediumInvader>(position, 1, 20)
    }

    spawnSmallInvaderAt(position: Point): SmallInvader {
        return this.spawnInvaderAt<SmallInvader>(position, 1, 30)
    }

    spawnInvaderAt<T extends Invader>(position: Point, hitpoints: number, score: number): T {
        return { position, hitpoints, score } as T
    }

    initInvaders(): InvadersGrid {
        const invadersGrid = Array<Array<LargeInvader | MediumInvader | SmallInvader | null>>(5)
            .fill(Array<LargeInvader | MediumInvader | SmallInvader | null>(this.invaderRowLength).fill(null)) as InvadersGrid

        const verticalGap = 1

        const firstPositionInRow = 
            (this.gameAreaWidth - (this.invaderWidth * this.invaderRowLength + (this.invaderWidth / 2) * (this.invaderRowLength - 1))) / 2
        let curY = 10

        for (let r = 0; r < 5; r++) {
            let curX = firstPositionInRow
            const spawner = 
                r < 2 
                    ? (p: Point) => this.spawnLargeInvaderAt(p) 
                    : r < 4 
                        ? (p: Point) => this.spawnMediumInvaderAt(p)
                        : (p: Point) => this.spawnSmallInvaderAt(p)

            let row = []
            for (let i = 0; i < this.invaderRowLength; i++) {
                row.push(spawner({X: curX, Y: curY + r * (this.invaderHeight + verticalGap)}))

                curX = curX + this.invaderWidth + this.invaderWidth / 2
            }
            invadersGrid[r] = row
        }

        return invadersGrid
    }

    updateInvaders(): void {
        const invadersGrid = this.gameState.invadersGrid

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

        let invadersDirection = this.gameState.invadersDirection
        let directionChanged = false

        for (let r = 0; r < invadersGrid.length; r++) {
            const invaders = invadersGrid[r].filter(a => a != null)

            for (let i = 0; i < invaders.length; i++) {
                const position = invaders[i]!.position
                position.X += invadersDirection * this.invaderSpeed

                if (position.X < minX)
                minX = position.X

                if (position.X > maxX)
                maxX = position.X

                if (invadersDirection == 1) {
                    if (maxX + this.invaderWidth >= this.gameAreaWidth) {
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
                    invaders[i]!.position.Y += this.invaderVerticalSpeed
                }
            }

            invadersDirection = -1 * invadersDirection

            directionChanged = false
        }

        this.gameState.invadersDirection = invadersDirection
        this.gameState.invadersGrid = invadersGrid
    }

    destroyInvader(invader: [number, number]): void {
        const [r, i] = invader
        this.gameState.invadersGrid[r][i] = null
    }

    renderInvaders(): void {
        const invadersGrid = this.gameState.invadersGrid
        for (let r = 0; r < invadersGrid.length; r++) {
            const invaders = invadersGrid[r].filter(a => a != null)

            for (let i = 0; i < invaders.length; i++) {
                this.renderGameObject(invaders[i]!.position, this.invaderWidth, this.invaderHeight)
            }
        }
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


type GameState = {
    cannonPosition: Point
    rightArrowPressed: boolean
    leftArrowPressed: boolean

    bullets: Array<Point>
    bulletReady: boolean

    invadersDirection: number
    invadersGrid: InvadersGrid 
    invaderBulletReady: boolean
    invaderBullets: Array<Point>
}

type GameObject = {}

type Invader = GameObject & {
    position: Point
    hitpoints: number
    score: number
}

type LargeInvader = Invader 
type MediumInvader = Invader
type SmallInvader = Invader

type InvadersRow = Array<LargeInvader | MediumInvader | SmallInvader | null>
type InvadersGrid = Array<InvadersRow>
