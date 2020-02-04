import {observable} from "mobx"
import {Player, playerStore} from "./players/PlayerStore"
import {spawn} from "./components/SpawnedComponent"
import {add} from "./EntityStore"
import {Adventurer} from "./entities/minions/Adventurer"

class DebugStore {
    @observable
    debugUiEnabled: boolean = false

    @observable
    debugLastKeyPressed: string | undefined = undefined


    // Stub AI loop
    forceSpawn() {
        const p1 = playerStore.player1!
        const p2 = playerStore.player2!

        const spawnSquad = (commander: Player) => {
            add(spawn(Adventurer(0, 0, commander), commander.topLane))
            add(spawn(Adventurer(0, 0, commander), commander.bottomLane))
        }
        spawnSquad(p1)
        spawnSquad(p2)

    }


}

export const debugStore = new DebugStore()