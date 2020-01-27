import * as Phaser from "phaser"
import {Entity, EntityComponent} from "../../ECS/ECS"

export const SpriteComponentKind = "sprite"

export interface SpriteComponent  {
    kind: string,
    sprite: Phaser.GameObjects.Sprite
}

export const sprited = (entity: Entity, sprite: Phaser.GameObjects.Sprite): Entity => {
    return {
        ...entity, components: entity.components.set(SpriteComponentKind,  {
            kind: SpriteComponentKind,
            sprite
        } as EntityComponent)
    }
}
