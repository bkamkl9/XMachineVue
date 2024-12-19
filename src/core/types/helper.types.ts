import type { ComputedRef } from 'vue'

export type AnyFunction = (this: any, ...args: any[]) => any

export type AnyObject = Record<any, any>

export type RemoveThis<S> = {
  [state in keyof S]: {
    [action in keyof Omit<S[state], '$onEnter' | '$onLeave'>]: S[state][action] extends (
      ...args: infer Args
    ) => infer ReturnValue
      ? (...args: Args) => ReturnValue
      : never
  }
}

export type MethodToComputed<C> = {
  [key in keyof C]: C[key] extends () => infer ReturnValue ? ComputedRef<ReturnValue> : never
}
