export const randomInt = (max: number) => Math.floor(Math.random() * Math.floor(max));
export const randomBool = () => randomInt(100) > 50
