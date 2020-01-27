import * as Phaser from "phaser"
import {Entity} from "../../ECS/ECS"

export const SpriteComponentKind = "sprite"

export interface SpriteComponent  {
    sprite: Phaser.GameObjects.Sprite
}

export const sprited = (entity: Entity, sprite: Phaser.GameObjects.Sprite): Entity & SpriteComponent => {
    return {
        ...entity, components: entity.components.add(SpriteComponentKind),
        sprite
    }
}
