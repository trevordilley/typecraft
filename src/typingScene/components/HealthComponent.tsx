import {Entity, EntityComponent} from "../../ECS/ECS"

export const HealthComponentKind = "healthy"
export interface HealthComponent  {
    kind: string,
    hitPoints: number,
    maxHitPoints: number
}
export const healthy = (entity: Entity, hitPoints: number, maxHitPoints?: number): Entity  => {
    return {
        ...entity,
        components: entity.components.set(HealthComponentKind,  {
            kind: HealthComponentKind,
            hitPoints,
            maxHitPoints: maxHitPoints ?? hitPoints
        } as EntityComponent)
    }
}
