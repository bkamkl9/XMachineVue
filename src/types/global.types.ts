import type { AnyFunction } from './helper.types'

declare global {
  namespace XMACHINEVUE {
    type ActionThisContext = {}
    type AdditionalActions = {}
    type CreateMachineReturnType = {}
    type MachineSchema = {
      initial: string
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
