import {healthy, healthyT} from "../../components/HealthComponent"
import {AnimData, sprited, spritedT} from "../../components/SpriteComponent"
import {moves, movesT} from "../../components/MovementComponent"
import {positioned} from "../../components/PositionComponent"
import {Assets} from "../../TypingScene"
import {combatant, combatantT} from "../../components/CombatantComponent"
import {Player} from "../../players/PlayerStore"
import {entity} from "./Entity";

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
) =>
    combatantT(healthyT(movesT(spritedT(positioned({},x,y), asset, animData), speed), hitPoints), {
        curCooldown: 0,
        maxCooldown: 1500,
        damage: 20,
        range: 40
    }, commander)


