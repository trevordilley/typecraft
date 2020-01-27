import {Entity} from "../ECS/ECS"
import {observable} from "mobx"
class EntityStore {
    @observable
    entities: Entity[] = []
}

export const entityStore = new EntityStore()