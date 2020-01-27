import * as Phaser from 'phaser'
import {entity, Entity} from "../../../ECS/ECS"
import { healthy} from "../../components/HealthComponent"
import { sprited} from "../../components/SpriteComponent"
import { moves} from "../../components/MovementComponent"

export const Minion = (
    hitPoints: number,
    speed: number,
    sprite: Phaser.GameObjects.Sprite
    ): Entity   =>
     healthy(moves(sprited(entity(),sprite), speed), hitPoints)


