import {Entity, EntityComponent} from "../../ECS/ECS"

export const MovementComponentKind = "moves"

export interface MovementComponent  {
    speed: number,
    destination?: { x: number, y: number }
}

export const moves = (entity: Entity, speed: number, destination?: { x: number, y: number }): Entity & MovementComponent  => {
    return {
        ...entity,
        components: entity.components.add(MovementComponentKind),
        speed,
        destination
    }
}
