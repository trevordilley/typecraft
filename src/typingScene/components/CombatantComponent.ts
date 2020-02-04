import {Entity} from "../../ECS/ECS"
import {Player} from "../players/PlayerStore"
import {SpriteComponent} from "./SpriteComponent"

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

export const combatant = (entity: Entity & Partial<SpriteComponent>, attack: Attack, commander: Player): Entity & CombatantComponent => {
    const e = {
        ...entity,
        components: entity.components.add(CombatantComponentKind),
        commander,
        attack
    }
    if (e.sprite) {
        e.sprite!.tint = commander.tint
    }
    return e
}
