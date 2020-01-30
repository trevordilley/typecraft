import {Entity} from "../../ECS/ECS"

export const PositionComponentKind = "positioned"

export interface PositionComponent  {
    x: number,
    y: number
}

export const positioned = (entity: Entity, x: number, y: number): Entity & PositionComponent  => {
    return {
        ...entity,
        components: entity.components.add(PositionComponentKind),
        x,
        y
    }
}
