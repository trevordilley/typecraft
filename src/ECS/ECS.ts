import * as _ from 'lodash'

export interface Entity {
    components: Set<string>
}
export const entity = (): Entity => ({components: new Set<string>()})


export interface EntityComponent {
    kind: string
}

export interface System {
    allOf?: Set<string>, // Execute on entities that have all these componentsStrings
    oneOf?: Set<string>, // And on entities that have one of these componentsStrings
    noneOf?: Set<string>, // And on entities that have none of these componentsStrings
    execute:  (entities: any[]) => Entity[]
}

const allOf = (entity: Entity, expected: string[]): boolean =>
    expected //?
        .map (e => entity.components.has(e)) //?
        .reduce((p, c) => p && c)


const oneOf = (e: Entity, expected: Set<String>) =>
   Array.from(e.components.keys())
       .map(c => expected.has(c))
       .reduce((p,c) => p || c)


export const engine = (
    allEntities: Entity[],
    systems: System[]
): Entity[] => {
    let entities: Entity[] = allEntities
    systems.forEach(s => {
        const [toProcess, others] = _.partition(entities, e => {
            const all = (s.allOf) ? allOf(e, Array.from(s.allOf)) : true
            const one = (s.oneOf) ? oneOf(e, s.oneOf ) : true
            const noneOf = (s.noneOf) ? !oneOf(e, s.noneOf) : true
            return all && one && noneOf
        })
        entities = s.execute(toProcess).concat(others)
    })
    return entities
}

interface E2 {
    components: Set<string>
}


// const e = (): E2 => ({components: new Set<string>()})
// interface Health2 {
//     hitPoints: number
// }
// const h = (e: E2, hitPoints: number): E2 & Health2 => ({
// ...e, components: e.components.add("health"), hitPoints
// })
//
// interface Sprite2 {
//     sprite: string
// }
// const s = (e: E2, sprite: string): {components: Set<string>} & Sprite2 =>
//     ({...e, components: e.components.add("sprite"), sprite})
//
// const m = s(h(e(),10),"sprite")
// console.log(m)
//
// interface Sys<T> {
//     allOf?: Set<string>, // Execute on entities that have all these componentsStrings
//     oneOf?: Set<string>, // And on entities that have one of these componentsStrings
//     noneOf?: Set<string>, // And on entities that have none of these componentsStrings
//     process: (e: T[]) => E2[]
// }
//
// const e = (entities: E2[], sys: Sys[]) => {
//     sys.forEach((s) => {
//
//     })
// }
