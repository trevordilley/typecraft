import {sprited} from "../../components/SpriteComponent"
import {entity} from "../../../ECS/ECS"
import {healthy} from "../../components/HealthComponent"
import {sceneStore} from "../../../SceneStore"
import {TYPING_SCENE_ASSETS} from "../../TypingScene"

const defaultHitPoints = 240
export const Tower = (x: number, y: number, hitPoints: number = defaultHitPoints) =>
    healthy(
        sprited(
            entity(),
            sceneStore.scene!.add.sprite(x, y, TYPING_SCENE_ASSETS.Tower)
        ),
        hitPoints
    )