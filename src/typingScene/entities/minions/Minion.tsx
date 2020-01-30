import * as Phaser from 'phaser'
import {entity, Entity} from "../../../ECS/ECS"
import { healthy} from "../../components/HealthComponent"
import {AnimData, sprited} from "../../components/SpriteComponent"
import { moves} from "../../components/MovementComponent"
import {positioned} from "../../components/PositionComponent"
import {Assets} from "../../TypingScene"

// speed in pixels
// deltaT at 60 FPS ~= 16ms
// 10 pixels per frame is pretty fast
// So a good speed would be around 6-7 px

export const DEFAULT_SPEED = 0.2
export const Minion = (
    hitPoints: number,
    x: number,
    y: number,
    speed: number,
    asset: Assets,
    animData?: AnimData[]
    ): Entity   =>
     positioned(healthy(moves(sprited(entity(),asset, animData), speed), hitPoints), x, y)


