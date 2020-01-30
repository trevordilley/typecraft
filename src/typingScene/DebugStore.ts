import {observable} from "mobx"
import {playerStore, SpawnPoint} from "./players/PlayerStore"
import {Entity} from "../ECS/ECS"
import {MovementComponent} from "./components/MovementComponent"
import {PositionComponent} from "./components/PositionComponent"
import {spawn} from "./components/SpawnedComponent"
import {add} from "./EntityStore"
import {randomBool, randomInt} from "../Util"
import {Adventurer} from "./entities/minions/Adventurer"
import {Minotaur} from "./entities/minions/Minotaur"
import {Dwarf} from "./entities/minions/Dwarf"
import {Witch} from "./entities/minions/Witch"
import {Builder} from "./entities/minions/Builder"
import {Gladiator} from "./entities/minions/Gladiator"

class DebugStore {
    @observable
    debugUiEnabled: boolean = false

    @observable
    debugLastKeyPressed: string | undefined = undefined


    // Stub AI loop
    randomSpawn() {

        const [player, opponent] = randomBool() ?
            [playerStore.player1, playerStore.player2] :
            [playerStore.player2, playerStore.player1]

        if (!player || !opponent) {
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