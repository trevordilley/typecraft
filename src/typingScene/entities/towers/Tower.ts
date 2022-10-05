import {sprited, spritedT} from "../../components/SpriteComponent"
import {healthy, healthyT} from "../../components/HealthComponent"
import {Assets} from "../../TypingScene"
import {SpawnDirection} from "../../players/PlayerStore"
import {positioned} from "../../components/PositionComponent";

const defaultHitPoints = 240
export const Tower = <T>(x: number, y: number, spawnDirection: SpawnDirection, hitPoints: number = defaultHitPoints
) => ({...healthyT(spritedT(positioned({}, x, y), Assets.Tower ), hitPoints ), spawnDirection })
