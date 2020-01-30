import {observable} from "mobx"

class TimeStore {
    @observable
    dilation = 1

    @observable
    paused: boolean = false

    togglePause() {
        this.paused = !this.paused
        if (this.paused) {
            this.dilation = 0.01
        } else {
            this.dilation = 1
        }
    }
}

export const timeStore = new TimeStore()