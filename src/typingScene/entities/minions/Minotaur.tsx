import {DEFAULT_SPEED, Minion} from "./Minion"
import {Assets} from "../../TypingScene"
import {AnimationName} from "../../components/SpriteComponent"
import {Player} from "../../players/PlayerStore"
import {Entity} from "@trevordilley/ecs"

const defaultHitPoints = 100
const defaultSpeed = DEFAULT_SPEED
export const Minotaur = (
    x: number,
    y: number,
    commander: Player,
    hitPoints?: number,
    speed?: number
) =>
    Minion(
        hitPoints ?? defaultHitPoints,
        x, y,
        speed ?? defaultSpeed,
        Assets.Minotaur,
        commander,
        [
            {name: AnimationName.IDLE, start: 0, end: 4, frameRate: 20},
            {name: AnimationName.MOVING, start: 11, end: 18, frameRate: 20},
            {name: AnimationName.ATTACK, start: 31, end: 39, frameRate: 20},
            {name: AnimationName.DEATH, start: 91, end: 96, frameRate: 20}
        ]
    )
