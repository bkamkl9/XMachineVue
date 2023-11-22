import { ReactiveState } from '../modules/reactive-state'
import { AnyFunction } from './primitive'

export type ACTION_CONTEXT<S, R extends {}, C extends keyof S> = {
  $changeState: (state: keyof S) => void
  $resetReactive: ReactiveState<R>['resetReactive']
  $reactive: ReactiveState<R>['reactive_state']
} & MACHINE_SCHEMA<S, R>[C]

export type MACHINE_SCHEMA<S, R extends {}> = {
  [state in keyof S]: {
    [action in keyof S[state]]: S[state][action] extends (
      this: ACTION_CONTEXT<S, R, state>,
      ...args: infer P
    ) => infer RT
      ? (this: ACTION_CONTEXT<S, R, state>, ...args: P) => RT
      : never
  } & S[state]
}
export type WRAPPED_ACTION<S, R extends {}> = (...args: any) => MACHINE_SCHEMA<S, R>[keyof S]

export type MACHINE_BODY<S, R extends {}> = {
  [state in keyof MACHINE_SCHEMA<S, R>]: {
    [action in keyof MACHINE_SCHEMA<S, R>[state]]: WRAPPED_ACTION<S, R>
  }
}

export type RemoveActionThisContext<T> = {
  [state in keyof T]: {
    [action in keyof T[state]]: T[state][action] extends AnyFunction
      ? (...args: Parameters<T[state][action]>) => ReturnType<T[state][action]>
      : never
  }
}
