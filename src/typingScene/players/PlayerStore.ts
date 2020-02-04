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
export enum LanePosition {
    BOTTOM, TOP
}

export interface Lane {
    origin: SpawnPoint,
    destination: SpawnPoint
}

export interface Player {
    topLane: Lane,
    bottomLane: Lane,
    currentLanePosition: LanePosition,
    tint: number,
    towerPoints: number
}


class PlayerStore {
    @observable
    player1: Player | undefined = undefined
    @observable
    player2: Player | undefined = undefined
}

export const playerStore = new PlayerStore()