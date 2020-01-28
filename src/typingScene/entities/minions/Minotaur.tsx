import {Entity} from "../../../ECS/ECS"
import {DEFAULT_SPEED, Minion} from "./Minion"
import {sceneStore} from "../../../SceneStore"
import {TYPING_SCENE_ASSETS} from "../../TypingScene"

const defaultHitPoints = 100
const defaultSpeed = DEFAULT_SPEED
export const Minotaur = (
    x:number,
    y: number,
    hitPoints?: number,
    speed?: number
): Entity =>
    Minion(
        hitPoints ?? defaultHitPoints,
        speed ?? defaultSpeed,
        sceneStore.scene!.add.sprite(x, y, TYPING_SCENE_ASSETS.Minotaur)
    )