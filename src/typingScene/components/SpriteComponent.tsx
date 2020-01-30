import * as Phaser from "phaser"
import {Entity} from "../../ECS/ECS"
import {Assets} from "../TypingScene"
import {sceneStore} from "../../SceneStore"
import {PositionComponent} from "./PositionComponent"

export const SpriteComponentKind = "sprite"

export interface SpriteComponent  {
    sprite: Phaser.GameObjects.Sprite,
    asset: Assets
}

export interface AnimData {
    name: string,
    start: number,
    end: number,
    frameRate: number,
    repeat?: number
}

export enum AnimationName {
    IDLE="idle",
    MOVING="moving",
    ATTACK="attack",
    DEATH="death",
}



export const animName = (name: string, asset: Assets) => `${asset}-${name}`

export const sprited = (entity: Entity & Partial<PositionComponent>,
                        asset: Assets,
                        animData?: AnimData[]
): Entity & SpriteComponent => {

    const sprite = sceneStore.scene!.add.sprite(entity.x ?? 0, entity.y ?? 0, asset)

    animData?.forEach(data => {
        const animKey = animName(data.name, asset)
        if(!sceneStore.scene!.anims.exists(animKey)) {
            sceneStore.scene!.anims.create({
                key: animName(data.name, asset),
                frames: sceneStore.scene!.anims.generateFrameNumbers(asset, {
                    start: data.start,
                    end: data.end
                }),
                frameRate: data.frameRate,
                repeat: data.repeat ?? -1
            })
        }
    })

    return {
        ...entity,
        components: entity.components.add(SpriteComponentKind),
        sprite,
        asset
    }
}
