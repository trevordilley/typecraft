import {Entity} from "../../ECS/ECS"
import {SpawnDirection} from "../PlayerStore"

export const SpawnDirectionComponentKind = "spawnDirection"
export interface SpawnDirectionComponent  {
    spawnDirection: SpawnDirection
}

export const spawnFrom = (entity: Entity, spawnDirection: SpawnDirection): Entity & SpawnDirectionComponent  => {
    return {
        ...entity,
        components: entity.components.add(SpawnDirectionComponentKind),
        spawnDirection
    }
}
