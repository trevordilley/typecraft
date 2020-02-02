import {Entity} from "../../ECS/ECS"
import {Player} from "../players/PlayerStore"

export interface Attack {
    maxCooldown: number,
    curCooldown: number,
    damage: number,
    range: number
}

export const CombatantComponentKind = "combatant"

export interface CombatantComponent {
    commander: Player,
    attack: Attack
}

export const combatant = (entity: Entity, attack: Attack, commander: Player): Entity & CombatantComponent => {
    return {
        ...entity,
        components: entity.components.add(CombatantComponentKind),
        commander,
        attack
    }
}
