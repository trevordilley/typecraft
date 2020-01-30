import {Entity} from "../../ECS/ECS"
import {SpawnDirection, SpawnPoint} from "../players/PlayerStore"
import {randomInt} from "../../Util"

export const SpawnedComponentKind = "spawned"
const spawnOffset = 100
const spawnRadius = 50
export const spawn = (entity: Entity, spawnPoint: SpawnPoint ): Entity & SpawnPoint =>
    ({
        ...entity,
        x: spawnPoint.x + ((spawnPoint.spawnDirection === SpawnDirection.LEFT) ? -spawnOffset : spawnOffset),
        y: spawnPoint.y + randomInt(spawnRadius) * (randomInt(10) > 5 ? 1 : -1),
        spawnDirection: spawnPoint.spawnDirection,
        components: entity.components.add(SpawnedComponentKind)
    })
