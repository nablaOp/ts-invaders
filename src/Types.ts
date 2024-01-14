import { IViewport } from './IViewport'
import type { Point } from './Point'

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

    cannonBulletPosition: Point | null

    invadersDirection: number
    invadersGrid: InvadersGrid 
    invaderBulletPosition: Point | null
}

export const gameOver = (gameState: GameState): boolean => {
    return gameState.cannonHitpoints == 0 || gameState.invadersGrid.every(r => r.every(i => i == null))
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
