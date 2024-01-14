import { IViewport } from './IViewport'
import type { Point } from './Point'

export type GameState = {
    viewport: IViewport
    viewportWidth: number,
    viewportHeight: number

    score: number, 

    cannonPosition: Point
    cannonHitpoints: number
    rightArrowPressed: boolean
    leftArrowPressed: boolean

    bullets: Array<Point>
    bulletReady: boolean

    invadersDirection: number
    invadersGrid: InvadersGrid 
    invaderBulletReady: boolean
    invaderBullets: Array<Point>
}

export type GameObject = {}

export type Invader = GameObject & {
    position: Point
    hitpoints: number
    score: number
}

export type LargeInvader = Invader 
export type MediumInvader = Invader
export type SmallInvader = Invader

export type InvadersRow = Array<LargeInvader | MediumInvader | SmallInvader | null>
export type InvadersGrid = Array<InvadersRow>
