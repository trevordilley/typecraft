import {DEFAULT_SPEED, Minion} from "./Minion"
import {Assets} from "../../TypingScene"
import {AnimationName} from "../../components/SpriteComponent"
import {Player} from "../../players/PlayerStore"
import {Entity} from "@trevordilley/ecs"

const defaultHitPoints = 100
const defaultSpeed = DEFAULT_SPEED
export const Adventurer = (
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
        Assets.Adventurer,
        commander,
        [
            {name: AnimationName.IDLE, start: 0, end: 12, frameRate: 20},
            {name: AnimationName.MOVING, start: 13, end: 20, frameRate: 20},
            {name: AnimationName.ATTACK, start: 49, end: 58, frameRate: 20},
            {name: AnimationName.DEATH, start: 97, end: 103, frameRate: 20}
        ]
    )
