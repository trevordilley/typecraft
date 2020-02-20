import {Lane, SpawnDirection, SpawnPoint} from "../players/PlayerStore"
import {randomInt} from "../../Util"
import {MovementComponent} from "./MovementComponent"
import {Entity} from "@trevordilley/ecs"

export const SpawnedComponentKind = "spawned"
const spawnOffset = 100
const spawnRadius = 50
export const spawn = (entity: Entity & Partial<MovementComponent>, lane: Lane ): Entity & SpawnPoint & Partial<MovementComponent>=>
    ({
        ...entity,
        x: lane.origin.x + ((lane.origin.spawnDirection === SpawnDirection.LEFT) ? -spawnOffset : spawnOffset),
        y: lane.origin.y + randomInt(spawnRadius) * (randomInt(10) > 5 ? 1 : -1),
        spawnDirection: lane.origin.spawnDirection,
        destination: lane.destination,
        finalDestination: lane.destination,
        components: entity.components.add(SpawnedComponentKind),
    })
