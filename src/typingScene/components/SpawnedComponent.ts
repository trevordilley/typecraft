import {Lane, SpawnDirection, SpawnPoint} from "../players/PlayerStore"
import {randomInt} from "../../Util"
import {MovementComponent} from "./MovementComponent"

export const SpawnedComponentKind = "spawned"
const spawnOffset = 100
const spawnRadius = 50
export const spawn = <T>(entity: T, lane: Lane ): T & SpawnPoint & Pick<MovementComponent, "destination" | "finalDestination">=>
    ({
        ...entity,
        x: lane.origin.x + ((lane.origin.spawnDirection === SpawnDirection.LEFT) ? -spawnOffset : spawnOffset),
        y: lane.origin.y + randomInt(spawnRadius) * (randomInt(10) > 5 ? 1 : -1),
        spawnDirection: lane.origin.spawnDirection,
        destination: lane.destination,
        finalDestination: lane.destination,
    })
