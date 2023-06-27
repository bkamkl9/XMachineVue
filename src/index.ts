import { reactive, ref } from 'vue'

type ActionCTX<T> = {
  state: T
  changeState: ReturnType<typeof createMachine>['changeState']
  dispatch: ReturnType<typeof createMachine>['dispatch']
}

type Action<T> = (this: ActionCTX<T>, ...args: any[]) => any

type StateDefinition<T> = {
  [state: string]: {
    onEnter?: (this: ActionCTX<T>) => any
    onLeave?: (this: ActionCTX<T>) => any
    [action: string]: Action<T> | undefined
  }
}

/**
 * Creates new state machine
 * @param schema - schema of state machine with reactive data.
 * @returns state - reactive state
 * @returns current - ref value of current state
 * @returns dispatch - function used for calling actions
 * @returns changeState - function used for changing state
 */
export function createMachine<T extends {}, K extends StateDefinition<T>>(schema: { state: () => T; actions: K }) {
  type STATES = keyof K
  type ACTION<S> = S extends string ? keyof K[S] : keyof K[string]

  const current = ref('')
  const state = reactive({ ...schema.state() }) as T
  const actionCTX = { dispatch, state, changeState }

  /**
   * Changes state of state machine
   * @param state - state id (eg. "INITIAL")
   */
  function changeState(state: STATES) {
    const id = state as string
    const exists = schema.actions[id]
    const previous = current.value

    if (!exists) throw new Error(`state "${id}" is not defined`)

    schema.actions[previous]?.onLeave?.call(actionCTX)
    current.value = id
    schema.actions[id]?.onEnter?.call(actionCTX)
  }

  /**
   * Executes action. For better TS support provide string literal with state name in generic.
   * @param action - action name
   * @param args - action arguments
   */
  function dispatch<STATE extends STATES>(action: ACTION<STATE>, ...args: any[]) {
    const name = action as string
    const state = current.value as string
    const method = schema.actions[state][name]
    const exists = typeof method === 'function'
    const error = `Action "${name}" don't exists in state "${state}"`

    if (!exists) throw new Error(error)

    method.call(actionCTX, ...args)
  }

  return {
    current,
    state,
    dispatch,
    changeState,
  }
}
