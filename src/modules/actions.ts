import { resetReactive } from './reactive.ts'
import { changeState } from './states.ts'

function createThisContext(id: string) {
  const current = window.__XMACHINE__[id].current.value
  const $actions = window.__XMACHINE__[id].schema[current as string]
  const $reactive = window.__XMACHINE__[id].reactive
  const $changeState = (state: string) => changeState(id, state)
  const $resetReactive = () => resetReactive(id)

  return {
    $reactive,
    $changeState,
    $resetReactive,
    ...$actions,
  }
}

export function initializeActions(id: string) {
  const states = window.__XMACHINE__[id].schema
  const current = window.__XMACHINE__[id].current

  for (const state in states) {
    for (const actionKey in states[state]) {
      const action = states[state][actionKey]
      const thisContext = createThisContext(id)

      states[state][actionKey] = (...args: any[]) => {
        if (current.value === state) return action.call(thisContext, ...args)
        throw new Error(`Cannot execute methods from ${state} when state is ${current.value}`)
      }
    }
  }
}
