import type { AnyFunction, AnyObject } from './helper.types'

declare global {
  namespace XMACHINEVUE {
    type ActionThisContext = {
      $resetReactive: AnyFunction
      $changeState: AnyFunction
      $reactive: AnyObject
    } & { [key in string]: unknown }

    type AdditionalActions = {}

    type CreateMachineReturnType = {}

    type MachineSchema = {
      initial: string
      reactive: AnyObject
      states: {
        [state in string]: {
          [action in string]: AnyFunction
        }
      }
    }

    type ActionObjectSchema = {
      [state in string]: {
        [action in string]: AnyFunction
      }
    }
  }
}
