import type { AnyFunction } from './helper.types'

declare global {
  namespace XMACHINEVUE {
    type ActionObjectSchema = {
      [state in string]: {
        [action in string]: AnyFunction
      }
    }

    interface MachineTemplate<R, S, G, C> {
      debug?: boolean
      initial: keyof S
      reactive?: R
      useLocalStorage?: boolean
      computed?: {
        [key in keyof C]: C[key] extends () => infer Return
          ? (this: {
              readonly $reactive: R
              $resetReactive: () => void
              $changeState: (state: keyof S) => void
            }) => Return
          : C[key] extends Function
            ? C[key]
            : never
      }
      global?: {
        [key in keyof G]: G[key] extends (...args: infer Parameters) => infer Return
          ? (
              this: {
                $reactive: R
                $resetReactive: () => void
                $changeState: (state: keyof S) => void
              },
              ...args: Parameters
            ) => Return
          : G[key] extends Function
            ? G[key]
            : never
      }
      states: {
        [state in keyof S]: {
          [action in keyof S[state]]: S[state][action] extends (...args: infer Parameters) => infer Return
            ? (
                this: {
                  $resetReactive: () => void
                  $changeState: (state: keyof S) => void
                  $reactive: R
                } & Omit<S[state], '$onEnter' | '$onLeave'>,
                ...args: Parameters
              ) => Return
            : never
        } & S[state]
      }
    }
  }
}
