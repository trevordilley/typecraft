import * as Phaser from 'phaser'
import {entity, Entity} from "../../../ECS/ECS"
import { healthy} from "../../components/HealthComponent"
import { sprited} from "../../components/SpriteComponent"
import { moves} from "../../components/MovementComponent"
import {positioned} from "../../components/PositionComponent"

// speed in pixels
// deltaT at 60 FPS ~= 16ms
// 10 pixels per frame is pretty fast
// So a good speed would be around 6-7 px

export const DEFAULT_SPEED = 0.5
export const Minion = (
    hitPoints: number,
    speed: number,
    sprite: Phaser.GameObjects.Sprite
    ): Entity   =>
     positioned(healthy(moves(sprited(entity(),sprite), speed), hitPoints), sprite.x, sprite.y)


