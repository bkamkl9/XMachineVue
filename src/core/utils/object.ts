const isObj = (obj: unknown) => typeof obj === 'object' && !Array.isArray(obj)

export function recursiveReassign(obj: Record<any, any>, def: Record<any, any>) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(def, key)) {
      if (isObj(obj[key])) recursiveReassign(obj[key], def[key])
      obj[key] = def[key]
    } else {
      obj[key] = undefined
      delete obj[key]
    }
  }
}
