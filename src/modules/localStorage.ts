import { watch, reactive } from 'vue'

const { parse, stringify } = JSON

function replacer(_key: string, value: object) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    }
  }

  if (value instanceof Set) {
    return {
      dataType: 'Set',
      value: Array.from(value), // or with spread: value: [...value]
    }
  }

  return value
}

function watchStorageChanges(id: string) {
  const watchOptions = { deep: true, flush: 'post', immediate: true } as const
  const watchSources = [window.__XMACHINE__[id].reactive, window.__XMACHINE__[id].current]
  watch(watchSources, () => saveStorageSnapshot(id), watchOptions)
}

export function saveStorageSnapshot(id: string) {
  const { reactive, current } = window.__XMACHINE__[id]
  const localStorageId = `__XMACHINE__.ID(${id})`
  const stringified = stringify({ reactive, current: current.value }, replacer, 2)

  localStorage.setItem(localStorageId, stringified)
}

export function loadStorageSnapshot(id: string) {
  const localStorageId = `__XMACHINE__.ID(${id})`
  const LocalStorageSave = localStorage.getItem(localStorageId)

  if (LocalStorageSave) {
    const snapshot = parse(LocalStorageSave, replacer)
    window.__XMACHINE__[id].reactive = reactive(snapshot.reactive)
    window.__XMACHINE__[id].current.value = snapshot.current
  }

  watchStorageChanges(id)
}
