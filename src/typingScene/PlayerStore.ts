import {computed, observable} from "mobx"
import {Entity} from "../ECS/ECS"
import {Adventurer} from "./entities/minions/Adventurer"

export enum SpawnDirection {
    RIGHT,
    LEFT
}

export interface SpawnPoint {
    x: number,
    y: number,
    direction: SpawnDirection
}

interface Player {
    topSpawn: SpawnPoint,
    bottomSpawn: SpawnPoint,
    currentSpawn: SpawnPoint
}

class PlayerStore {
    @observable
    player1: Player | undefined = undefined
    @observable
    player2: Player | undefined = undefined
}

export const playerStore = new PlayerStore()