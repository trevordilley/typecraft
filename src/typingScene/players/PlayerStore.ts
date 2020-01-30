import {observable} from "mobx"

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
}

export const playerStore = new PlayerStore()