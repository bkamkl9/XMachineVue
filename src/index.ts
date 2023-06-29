import { reactive, ref } from 'vue'
import type { Ref } from 'vue'

type SCHEMA = {
  [state: string]: {
    [action: string]: (this: any, ...args: any[]) => any
  }
}

export function createMachine<T extends SCHEMA, K extends {}>(schema: {
  state: () => K
  actions: T
}) {
  const reactiveState = reactive({ state: schema.state() })
  const currentState = ref<keyof T>()

  function changeState(state: keyof T & string) {
    const exits = Object.keys(schema.state).some(
      (statekey) => statekey === state
    )
    if (!exits) throw new Error(`State ${state} don't exists.`)

    if (currentState.value) {
      schema.actions[currentState.value]?.onLeave()
    }
    currentState.value = state
    schema.actions[state]?.onEnter()
  }

  function from<STATE extends keyof T & string>(state: STATE) {
    const exits = Object.keys(schema.state).some(
      (statekey) => statekey === state
    )
    if (!exits) throw new Error(`State ${state} don't exists.`)

    function execute<ACTION extends keyof T[STATE] & string>(
      action: ACTION,
      ...args: Parameters<T[STATE][ACTION]>
    ) {
      const method = schema.actions[state][action]
      if (typeof method !== 'function')
        throw new Error(`Action ${action} don't exists in state ${state}`)
      return method(...args) as ReturnType<T[STATE][ACTION]>
    }

    return {
      execute,
    }
  }

  function resetReactive(state?: keyof T & string) {
    ;(reactiveState.state as K) = schema.state()
    if (state) changeState(state)
  }

  return {
    from,
    state: reactiveState.state,
    current: currentState as Readonly<Ref<keyof T>>,
    changeState,
    resetReactive,
  }
}

const x = createMachine({
  state: () => ({ hello: 1 }),
  actions: {
    INITIAL: {
      helloworld() {},
    },
  },
})

x.resetReactive()
