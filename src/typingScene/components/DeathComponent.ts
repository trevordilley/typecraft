import {Entity} from "@trevordilley/ecs"

export const DeathComponentKind = "death"
export enum DeathState {
    NEW_DYING="NewDying",
    DYING="Dying",
    DEAD="Dead"
}
export interface DeathComponent  {
    deathState: DeathState
}

export const dying = (entity: Entity, deathState= DeathState.NEW_DYING): Entity & DeathComponent  => {
    return {
        ...entity,
        components: entity.components.add(DeathComponentKind),
        deathState: deathState,
    }
}
