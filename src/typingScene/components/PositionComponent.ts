
export const PositionComponentKind = "positioned"

export interface PositionComponent  {
    x: number,
    y: number
}

export const positioned = <T>(entity: T, x: number, y: number): T & PositionComponent  => {
    return {
        ...entity,
        x,
        y
    }
}

