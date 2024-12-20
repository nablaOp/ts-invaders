import type { Point } from "./Point"

// game area

const GAME_AREA_WIDTH = 256
const GAME_AREA_HEIGHT = 224

const GREEN_ZONE = 180
const RED_ZONE = 30

// Menu

const TOP_LINE = GAME_AREA_HEIGHT / 20

const SCORE_TITLE_POSITION: Point = {X: GAME_AREA_WIDTH / 50, Y: TOP_LINE} 
const SCORE_VALUE_POSITION: Point = {X: GAME_AREA_WIDTH / 50 + 30, Y: TOP_LINE}
const SCORE_TEXT = "SCORE"


const LIVES_TITLE_POSITION: Point = {X: GAME_AREA_WIDTH * 2 / 3, Y: TOP_LINE}
const LIVES_INITIAL_POSITION: Point = {X: GAME_AREA_WIDTH * 2 / 3 + 30, Y: 5}
const LIVES_TEXT = "LIVES"

const GAME_OVER_POSITION: Point = { X: GAME_AREA_WIDTH / 2 - 50, Y: GAME_AREA_HEIGHT / 2 }
const GAME_OVER_TEXT = "GAME OVER"

// cannon

const CANNON_WIDTH = 13
const CANNON_HEIGHT = 7
const CANNON_SPEED = 1.5 

// cannon bullet

const BULLET_WIDTH = 1 
const BULLET_HEIGHT = 5
const BULLET_MOVE_SPEED = GAME_AREA_HEIGHT / 60

// defense

const DEFENSE_INITIAL_TOP = 180
const BUNKER_WIDTH = 20
const BUNKER_HEIGHT = 20

// invader

const INVADER_WIDTH = 12
const INVADER_HEIGHT = 8
const INVADER_VERTICAL_GAP = 10
const INVADER_INITIAL_TOP = 40
const INVADER_ROW_LENGTH = 11
const INVADER_SPEED = GAME_AREA_WIDTH / 1400
const INVADER_SPEED_ADD = INVADER_SPEED / 6
const INVADER_VERTICAL_SPEED = 3

// invader bullet

const INVADER_BULLET_WIDTH = 1 
const INVADER_BULLET_HEIGHT = 5
const INVADER_BULLET_MOVE_SPEED = GAME_AREA_HEIGHT / 200

// ufo

const UFO_WIDTH = 10
const UFO_HEIGHT = 5
const UFO_INIT_POSITION = 20
const UFO_MOVE_SPEED = GAME_AREA_WIDTH / 400
const UFO_SPAWN_FACTOR = 300
const UFO_SCORE = [100, 50, 50, 100, 150, 100, 100, 50, 300, 100, 100, 100, 50, 150, 100]

export {
    GAME_AREA_WIDTH,
    GAME_AREA_HEIGHT,
    RED_ZONE,
    GREEN_ZONE,
    LIVES_TITLE_POSITION,
    LIVES_INITIAL_POSITION,
    LIVES_TEXT,
    SCORE_TITLE_POSITION,
    SCORE_VALUE_POSITION,
    SCORE_TEXT,
    GAME_OVER_POSITION,
    GAME_OVER_TEXT,
    CANNON_SPEED,
    CANNON_WIDTH,
    CANNON_HEIGHT,
    DEFENSE_INITIAL_TOP,
    BUNKER_WIDTH,
    BUNKER_HEIGHT,
    INVADER_SPEED,
    INVADER_SPEED_ADD,
    INVADER_VERTICAL_SPEED,
    INVADER_ROW_LENGTH,
    INVADER_WIDTH,
    INVADER_HEIGHT,
    INVADER_INITIAL_TOP,
    INVADER_VERTICAL_GAP,
    BULLET_WIDTH,
    BULLET_HEIGHT,
    BULLET_MOVE_SPEED,
    INVADER_BULLET_WIDTH,
    INVADER_BULLET_HEIGHT,
    INVADER_BULLET_MOVE_SPEED,
    UFO_WIDTH,
    UFO_HEIGHT,
    UFO_INIT_POSITION,
    UFO_MOVE_SPEED,
    UFO_SPAWN_FACTOR,
    UFO_SCORE
}
