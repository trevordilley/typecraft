import * as Phaser from "phaser"
import {observable} from "mobx"

class SceneStore {
    @observable
    scene?: Phaser.Scene
}

export const sceneStore: SceneStore = new SceneStore()