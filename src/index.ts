import type { StateTree, StoreOptions, ThisContext, OmitThis } from './types'
import { recursiveReset } from './utils'
import { reactive, ref } from 'vue'
import type { Ref } from 'vue'

export function defineMachine<S extends StateTree, SS>(options: StoreOptions<S, SS>) {
  type StatesKeys = keyof StoreOptions<S, SS>['states']

  const $current = ref('') as Ref<StatesKeys & string>
  const $state = reactive({ ...options.state() })
  const $states = new Set<StatesKeys>(Object.keys(options.states) as StatesKeys[])

  function from<FromState extends StatesKeys & string>(state: FromState) {
    type CurrentState = StoreOptions<S, SS>['states'][FromState]
    const stateSchema = options.states[state]
    const stateKeys = Object.keys(stateSchema) as (keyof StoreOptions<S, SS>['states'][FromState])[]
    if (!stateSchema) throw new Error(`${state} don't exists`)

    const actionArr = stateKeys.map((stateKey) => {
      const context = {
        state: $state,
        ...stateSchema,
        changeState,
        resetState,
        get $current() {
          return $current.value
        },
      } as ThisContext<S, SS, FromState>
      return {
        [stateKey]: (...args: any) => {
          if ($current.value !== state)
            throw new Error(
              `Cannot execute function from state "${state}", current state is ${
                $current.value ? '"' + $current.value + '"' : 'not defined'
              }`
            )
          return stateSchema[stateKey].call(context, ...args)
        },
      }
    })

    return Object.assign({}, ...actionArr) as Omit<
      {
        [k in keyof CurrentState]: OmitThis<CurrentState[k]>
      },
      'onEnter' | 'onLeave'
    >
  }

  function resetState() {
    recursiveReset($state, options.state())
  }

  function changeState<FromState extends StatesKeys & string>(state: FromState) {
    type Hooks = { onEnter?: () => void; onLeave?: () => void }
    type CurrentState = StoreOptions<S, SS>['states'][FromState] & Hooks
    if (!$states.has(state)) throw new Error(`State "${state}" is not defined in the machine`)

    const prevSchema = options.states[$current.value] as CurrentState
    const nextSchema = options.states[state] as CurrentState
    const prevContext = {
      state: $state,
      ...prevSchema,
      changeState,
      resetState,
      get $current() {
        return $current.value
      },
    } as ThisContext<S, SS, FromState>
    const nextContext = {
      state: $state,
      ...nextSchema,
      changeState,
      resetState,
      get $current() {
        return $current.value
      },
    } as ThisContext<S, SS, FromState>

    prevSchema?.onLeave?.call?.(prevContext)
    $current.value = state
    nextSchema?.onEnter?.call?.(nextContext)
  }

  return {
    $current,
    $state,
    from,
    resetState,
    changeState,
  }
}
