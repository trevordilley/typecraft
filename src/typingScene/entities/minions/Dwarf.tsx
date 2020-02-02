import {Entity} from "../../../ECS/ECS"
import {DEFAULT_SPEED, Minion} from "./Minion"
import {Assets} from "../../TypingScene"
import {AnimationName} from "../../components/SpriteComponent"
import {Player} from "../../players/PlayerStore"

const defaultHitPoints = 10
const defaultSpeed = DEFAULT_SPEED
export const Dwarf = (
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
        Assets.Dwarf,
        commander,

        [
            {name: AnimationName.IDLE, start: 0, end: 4, frameRate: 20},
            {name: AnimationName.MOVING, start: 11, end: 17, frameRate: 20},
            {name: AnimationName.ATTACK, start: 21, end: 26, frameRate: 20},
            {name: AnimationName.DEATH, start: 41, end: 47, frameRate: 20}
        ]
    )