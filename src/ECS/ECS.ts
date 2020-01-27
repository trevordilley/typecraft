import * as _ from 'lodash'

export interface Entity {
    components: Set<string>
}
export const entity = (): Entity => ({components: new Set<string>()})


export interface EntityComponent {
    kind: string
}

export interface System {
    allOf?: string[], // Execute on entities that have all these componentsStrings
    oneOf?: string[], // And on entities that have one of these componentsStrings
    noneOf?: string[], // And on entities that have none of these componentsStrings
    execute:  (entities:  Entity[]) => Entity[]
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
            const one = (s.oneOf) ? oneOf(e, new Set<string>(s.oneOf) ) : true
            const noneOf = (s.noneOf) ? !oneOf(e, new Set<string>(s.noneOf)) : true
            return all && one && noneOf
        })
        entities = s.execute(toProcess).concat(others)
    })
    return entities
}

