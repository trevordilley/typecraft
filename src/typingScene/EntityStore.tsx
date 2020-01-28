import {Entity} from "../ECS/ECS"
import {observable} from "mobx"
class EntityStore {
    @observable
    entities: Entity[] = []
}
export const entityStore = new EntityStore()
export const add = (e: Entity) => entityStore.entities.push(e)
