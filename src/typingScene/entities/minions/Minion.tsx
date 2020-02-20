import {healthy} from "../../components/HealthComponent"
import {AnimData, sprited} from "../../components/SpriteComponent"
import {moves} from "../../components/MovementComponent"
import {positioned} from "../../components/PositionComponent"
import {Assets} from "../../TypingScene"
import {combatant} from "../../components/CombatantComponent"
import {Player} from "../../players/PlayerStore"
import {entity, Entity} from "@trevordilley/ecs"

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
    commander: Player,
    animData?: AnimData[]
): Entity =>
    combatant(positioned(healthy(moves(sprited(entity(), asset, animData), speed), hitPoints), x, y), {
        curCooldown: 0,
        maxCooldown: 1500,
        damage: 20,
        range: 40
    }, commander)


