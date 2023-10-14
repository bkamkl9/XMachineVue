const isObj = (obj: unknown) => typeof obj === 'object' && !Array.isArray(obj)

export function recursiveReset(obj: Record<any, any>, def: Record<any, any>) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (isObj(obj[key])) recursiveReset(obj[key], def[key])
      obj[key] = def[key]
    }
  }
}

export function resetReactive(id: string) {
  const { reactive, initial_reactive } = window.__XMACHINE__[id]
  recursiveReset(reactive, initial_reactive)
}
