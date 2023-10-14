import { saveStorageSnapshot } from './localStorage.ts'

export function changeState(id: string, state: string) {
  const { current, useLocalStorage, schema } = window.__XMACHINE__[id]
  if (!schema[state]) throw new Error(`State "${state}" does not exits on machine with id ${id}`)

  schema[state].$onEnter?.()
  current.value = state
  schema[state].$onLeave?.()

  if (useLocalStorage) saveStorageSnapshot(id)
}
