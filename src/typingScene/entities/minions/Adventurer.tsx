import {Entity} from "../../../ECS/ECS"
import {DEFAULT_SPEED, Minion} from "./Minion"
import {Assets} from "../../TypingScene"
import {AnimationName} from "../../components/SpriteComponent"

const defaultHitPoints = 10
const defaultSpeed = DEFAULT_SPEED
export const Adventurer = (
    x: number,
    y: number,
    hitPoints?: number,
    speed?: number
): Entity =>
    Minion(
        hitPoints ?? defaultHitPoints,
        x, y,
        speed ?? defaultSpeed,
        Assets.Adventurer,
        [
            {name: AnimationName.IDLE, start: 0, end: 12, frameRate: 20},
            {name: AnimationName.MOVING, start: 13, end: 20, frameRate: 20},
            {name: AnimationName.ATTACK, start: 49, end: 58, frameRate: 20},
            {name: AnimationName.DEATH, start: 85, end: 91, frameRate: 20}
        ]
    )
