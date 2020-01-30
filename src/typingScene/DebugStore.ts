import {observable} from "mobx"

class DebugStore {
    @observable
    debugUiEnabled: boolean = false

    @observable
    debugLastKeyPressed: string | undefined = undefined
}

export const debugStore = new DebugStore()