let eid = 0

export interface Entity {
  eid: number
}

export const entity = <T>(e: T) => {
  eid = eid + 1
  return { [`${e}eid`]:  e}
}
