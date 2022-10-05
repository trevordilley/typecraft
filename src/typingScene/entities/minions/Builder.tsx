import {DEFAULT_SPEED, Minion} from "./Minion"
import {Assets} from "../../TypingScene"
import {AnimationName} from "../../components/SpriteComponent"
import {Player} from "../../players/PlayerStore"
import {Entity} from "@trevordilley/ecs"

const defaultHitPoints = 10
const defaultSpeed = DEFAULT_SPEED
export const Builder = (
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
        Assets.Builder,
        commander,
        [
            {name: AnimationName.IDLE, start: 0, end: 3, frameRate: 20},
            {name: AnimationName.MOVING, start: 9, end: 16, frameRate: 20},
            {name: AnimationName.ATTACK, start: 17, end: 24, frameRate: 20},
            {name: AnimationName.DEATH, start: 25, end: 28, frameRate: 20}
        ]
    )
