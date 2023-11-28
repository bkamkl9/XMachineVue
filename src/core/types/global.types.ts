import type { AnyFunction } from './helper.types'

declare global {
  namespace XMACHINEVUE {
    type ActionObjectSchema = {
      [state in string]: {
        [action in string]: AnyFunction
      }
    }

    interface MachineTemplate<R, S> {
      initial: keyof S
      reactive?: R
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
