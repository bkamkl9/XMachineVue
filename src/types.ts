import type { Ref } from 'vue'

type ActionThisActions<TStates, TStatesKey extends keyof TStates> = {
  [TActionKey in keyof Omit<TStates[TStatesKey], '$onEnter' | '$onLeave'>]: TStates[TStatesKey][TActionKey]
}

interface ActionThis<TStates, TState> {
  $changeState: (state: keyof TStates) => void
  $resetReactive: () => void
  $reactive: TState
}

export interface Schema<TStates, TState> {
  initial: keyof TStates & string
  reactive?: TState extends Record<string, unknown> ? TState : never
  useLocalStorage?: boolean
  states: {
    [TStatesKey in keyof TStates]: {
      [TActionsKey in keyof TStates[TStatesKey]]: TStates[TStatesKey][TActionsKey] extends (...args: infer P) => infer R
        ? (this: ActionThis<TStates, TState> & ActionThisActions<TStates, TStatesKey>, ...args: P) => R
        : never
    } & TStates[TStatesKey]
  }
}

export type ActionMethods<TStates, TState, TSchema extends Schema<TStates, TState>> = {
  [TStatesKey in keyof TSchema['states']]: {
    [TActionsKey in keyof TSchema['states'][TStatesKey]]: (
      ...args: Parameters<TSchema['states'][TStatesKey][TActionsKey]>
    ) => ReturnType<TSchema['states'][TStatesKey][TActionsKey]>
  }
}

type UnknownSchema = {
  [TState in string]: {
    [TAction in string]: (...args: any) => any
  }
}

type ReactiveState = Record<string, unknown>

declare global {
  interface Window {
    __XMACHINE__: {
      [key in string]: {
        useLocalStorage: boolean
        schema: UnknownSchema
        initial_reactive: ReactiveState
        reactive: ReactiveState
        current: Ref<string>
      }
    }
  }
}
