const simpleClone = <T>(obj: T) => JSON.parse(JSON.stringify(obj)) as T

export default simpleClone
