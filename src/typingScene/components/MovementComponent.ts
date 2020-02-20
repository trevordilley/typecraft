import {Entity} from "@trevordilley/ecs"

export const MovementComponentKind = "moves"

export interface MovementComponent {
    speed: number,
    destination?: { x: number, y: number }
    finalDestination?: { x: number, y: number }

}

export const moves = (entity: Entity, speed: number, destination?: { x: number, y: number }, finalDestination?: { x: number, y: number}): Entity & MovementComponent => {
    return {
        ...entity,
        components: entity.components.add(MovementComponentKind),
        speed,
        destination,
        finalDestination: finalDestination ?? destination
    }
}
