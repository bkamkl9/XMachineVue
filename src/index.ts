import type { Schema, ActionMethods } from './types.ts'
import { reactive, ref, computed } from 'vue'
import { loadStorageSnapshot } from './modules/localStorage.ts'
import { initializeActions } from './modules/actions.ts'
import { changeState } from './modules/states.ts'
import { resetReactive } from './modules/reactive.ts'

if (!window.__XMACHINE__) window.__XMACHINE__ = {}

export function createMachine<TStates, TState>(id: string, schema: Schema<TStates, TState>) {
  type Schema = typeof schema
  type Reactive = TState extends {} ? TState : undefined
  type Actions = ActionMethods<TStates, TState, Schema>
  type States = keyof Schema['states'] & string

  if (!window.__XMACHINE__[id]) {
    const initReactive = reactive(schema.reactive?.() || {})

    window.__XMACHINE__[id] = {
      useLocalStorage: !!schema.useLocalStorage,
      initial_reactive: initReactive,
      reactive: initReactive,
      schema: schema.states,
      current: ref(schema.initial),
    }

    if (schema.useLocalStorage) loadStorageSnapshot(id)

    initializeActions(id)
  }

  return {
    ...(window.__XMACHINE__[id].schema as Actions),
    reactive: window.__XMACHINE__[id].reactive as Reactive,
    changeState: (state: States) => changeState(id, state),
    resetReactive: () => resetReactive(id),
    current: computed(() => window.__XMACHINE__[id].current),
  }
}
