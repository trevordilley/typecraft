import {observable} from "mobx"
import {Entity} from "../../ECS/ECS"

export enum SpawnDirection {
    RIGHT,
    LEFT
}

export interface SpawnPoint {
    x: number,
    y: number,
    spawnDirection: SpawnDirection
}


export interface Player {
    topSpawn: SpawnPoint,
    bottomSpawn: SpawnPoint,
    currentSpawn: SpawnPoint,
}


class PlayerStore {
    @observable
    player1: Player | undefined = undefined
    @observable
    player2: Player | undefined = undefined

   // TODO setup easy spawn utility functions
   //  private spawnPlayer(player, entity)
   //  spawnPlayer1(entity: Entity, )
   //  spawnPlayer2(entity: Entity, )
}

export const playerStore = new PlayerStore()