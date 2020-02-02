import {Entity} from "../../ECS/ECS"

export const HealthComponentKind = "healthy"
export interface HealthComponent  {
    hitPoints: number,
    maxHitPoints: number,
    damages: number[]
}

export const healthy = (entity: Entity, hitPoints: number, maxHitPoints?: number, damages: number[] = []): Entity & HealthComponent  => {
    return {
        ...entity,
        components: entity.components.add(HealthComponentKind),
        hitPoints,
        maxHitPoints: maxHitPoints ?? hitPoints,
        damages
    }
}
