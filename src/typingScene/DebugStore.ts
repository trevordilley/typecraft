import {observable} from "mobx"
import {Player, playerStore, SpawnPoint} from "./players/PlayerStore"
import {Entity} from "../ECS/ECS"
import {MovementComponent} from "./components/MovementComponent"
import {PositionComponent} from "./components/PositionComponent"
import {spawn} from "./components/SpawnedComponent"
import {Minotaur} from "./entities/minions/Minotaur"
import {add} from "./EntityStore"
import {randomBool, randomInt} from "../Util"

class DebugStore {
    @observable
    debugUiEnabled: boolean = false

    @observable
    debugLastKeyPressed: string | undefined = undefined


    // Stub AI loop
    randomSpawn ()  {

        const [player, opponent] = randomBool() ?
            [playerStore.player1, playerStore.player2] :
            [playerStore.player2, playerStore.player1]

        if(!player || !opponent) {
            console.log(`Someone isn't defined: Player: ${player}, Opponent: ${opponent}`)
            return
        }

        const spawnSquad = (p: SpawnPoint, p2: SpawnPoint) => {
            const e: Entity & Partial<MovementComponent> & Partial<PositionComponent> = spawn(Minotaur(0, 0), p)
            e.destination! = {x: p2.x, y: e.y!}
            add(e)
        }
        const rand = randomInt(5)
        if (rand > 2) {
            spawnSquad(player.topSpawn, opponent.topSpawn)
        } else {
            spawnSquad(player.bottomSpawn, opponent.bottomSpawn)
        }

    }


}

export const debugStore = new DebugStore()