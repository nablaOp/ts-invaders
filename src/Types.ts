import { IViewport } from './IViewport'
import type { Point } from './Point'
import * as Constants from './Constants'

export type GameState = {
    viewport: IViewport
    viewportWidth: number,
    viewportHeight: number

    rightArrowPressed: boolean
    leftArrowPressed: boolean
    spacePressed: boolean

    score: number, 

    cannonPosition: Point
    cannonHitpoints: number

    cannonBulletCounter: number
    cannonBulletCounterDirection: number
    cannonBulletPosition: Point | null

    defenseSystem: DefenseSystem

    invadersDirection: number
    invadersGrid: InvadersGrid 
    invadersSpeed: number
    invaderBulletPosition: Point | null

    ufoPosition: Point | null
}

export const gameOver = (gameState: GameState): boolean => {
    return gameState.cannonHitpoints == 0 
        || gameState.invadersGrid.every(r => r.every(i => i == null))
        || gameState.invadersGrid.some(r => r.some(i => i != null && i.position.Y >= 179 - Constants.INVADER_HEIGHT))
}

export class GameObject {
    position!: Point
}

export class Invader extends GameObject {
    constructor(position: Point, hitpoints: number, score: number, width: number) {
        super()

        this.position = position
        this.hitpoints = hitpoints
        this.score = score
        this.width = width
        this.viewIdx = 0
        this.viewTick = 0
    }
    
    hitpoints: number
    score: number
    viewIdx: number
    viewTick: number
    width: number
}

export class LargeInvader extends Invader {}
export class MediumInvader extends Invader {}
export class SmallInvader extends Invader {}
export class DestroyedInvader extends GameObject {
    tick!: number
}

export type OneOfInvaders = LargeInvader | MediumInvader | SmallInvader | DestroyedInvader | null
export type InvadersRow = Array<OneOfInvaders>
export type InvadersGrid = Array<InvadersRow>

export const BunkerPointState = {
    Default: 1,
    Destroyed: 2,
    Unused: 3
} as const;

export type BunkerPoint = Point & {
   state: typeof BunkerPointState[keyof typeof BunkerPointState]
}
export type BunkerRow = Array<BunkerPoint>
export type BunkerPoints = Array<BunkerRow>

export type Bunker = GameObject & {
    points: BunkerPoints
}

export type DefenseSystem = Array<Bunker>
