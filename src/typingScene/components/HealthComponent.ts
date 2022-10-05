import {Entity} from "@trevordilley/ecs"

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
export const healthyT = <T>(entity: T, hitPoints: number, maxHitPoints?: number, damages: number[] = []): T & HealthComponent  => {
    return {
        ...entity,
        hitPoints,
        maxHitPoints: maxHitPoints ?? hitPoints,
        damages
    }
}
