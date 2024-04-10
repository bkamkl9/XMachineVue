const isObj = (obj: unknown) => typeof obj === "object" && !Array.isArray(obj);

export function recursiveReassign(
  obj: Record<any, any>,
  def: Record<any, any>,
) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(def, key)) {
      if (isObj(obj[key])) recursiveReassign(obj[key], def[key]);
      obj[key] = def[key];
    } else {
      obj[key] = undefined;
      delete obj[key];
    }
  }
}

export function replacer(_key: string, value: object) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  }

  if (value instanceof Set) {
    return {
      dataType: "Set",
      value: Array.from(value), // or with spread: value: [...value]
    };
  }

  return value;
}
