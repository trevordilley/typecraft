import {observable} from "mobx"

class Store {
    @observable
    count: number = 0
}

export const store = new Store()