import {DEFAULT_SPEED, Minion} from "./Minion"
import {Assets} from "../../TypingScene"
import {AnimationName} from "../../components/SpriteComponent"
import {Player} from "../../players/PlayerStore"
import {Entity} from "@trevordilley/ecs"

const defaultHitPoints = 100
const defaultSpeed = DEFAULT_SPEED
export const Gladiator = (
    x: number,
    y: number,
    commander: Player,
    hitPoints?: number,
    speed?: number
): Entity =>
    Minion(
        hitPoints ?? defaultHitPoints,
        x, y,
        speed ?? defaultSpeed,
        Assets.Gladiator,
        commander,

        [
            {name: AnimationName.IDLE, start: 0, end: 4, frameRate: 20},
            {name: AnimationName.MOVING, start: 9, end: 16, frameRate: 20},
            {name: AnimationName.ATTACK, start: 17, end: 23, frameRate: 20},
            {name: AnimationName.DEATH, start: 33, end: 39, frameRate: 20}
        ]
    )