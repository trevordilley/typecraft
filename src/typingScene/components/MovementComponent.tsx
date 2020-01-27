import {Entity, EntityComponent} from "../../ECS/ECS"

export const MovementComponentKind = "moves"

export interface MovementComponent  {
    kind: string,
    speed: number,
    destination?: { x: number, y: number }
}

export const moves = (entity: Entity, speed: number, destination?: { x: number, y: number }): Entity  => {
    return {
        ...entity,
        components: entity.components.set(MovementComponentKind,  {
            kind: MovementComponentKind,
            speed,
            destination
        } as EntityComponent)
    }
}
