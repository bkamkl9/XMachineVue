const isObj = (obj: unknown) => typeof obj === 'object' && !Array.isArray(obj)

export function recursiveReset(obj: Record<any, any>, def: Record<any, any>) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(def, key)) {
      if (isObj(obj[key])) recursiveReset(obj[key], def[key])
      obj[key] = def[key]
    } else {
      obj[key] = undefined
      delete obj[key]
    }
  }
}

export function resetReactive(id: string) {
  const machine = window.__XMACHINE__[id]
  recursiveReset(machine.reactive, machine.initial_reactive)
}
