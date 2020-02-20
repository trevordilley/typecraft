import {SpriteComponent, sprited} from "../../components/SpriteComponent"
import {HealthComponent, healthy} from "../../components/HealthComponent"
import {Assets} from "../../TypingScene"
import {SpawnDirection} from "../../players/PlayerStore"
import {positioned} from "../../components/PositionComponent"
import {entity, Entity} from "@trevordilley/ecs"

const defaultHitPoints = 240
export const Tower =
    (x: number, y: number, spawnDirection: SpawnDirection, hitPoints: number = defaultHitPoints):
        Entity &
        Partial<SpriteComponent> &
        Partial<HealthComponent> & { spawnDirection: SpawnDirection } => ({
        ...positioned(
            healthy(
                sprited(
                    entity(),
                    Assets.Tower
                ),
                hitPoints
            ), x, y),
        spawnDirection: spawnDirection
    })