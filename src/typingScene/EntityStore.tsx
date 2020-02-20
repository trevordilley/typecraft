import {observable} from "mobx"
import {Entity} from "@trevordilley/ecs"
class EntityStore {
    @observable
    entities: Entity[] = []
}
export const entityStore = new EntityStore()
export const add = (e: Entity): Entity => {
    entityStore.entities.push(e)
    return e
}
