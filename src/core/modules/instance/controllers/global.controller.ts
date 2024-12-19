import type { InstanceService } from '../instance.service'
import type { AnyFunction, AnyObject } from '../../../types/helper.types'
import type { MachineSchema } from '../instance.service'

interface GlobalThisContext {
  $resetReactive: AnyFunction
  $changeState: AnyFunction
  $reactive: AnyObject
}

interface GlobalObjectSchema {
  [key: string]: (this: GlobalThisContext, ...args: any[]) => any
}

export class GlobalController {
  InstanceService: InstanceService
  GlobalObject: GlobalObjectSchema

  constructor(InstanceService: InstanceService) {
    this.InstanceService = InstanceService
    this.GlobalObject = this.createObjectOfGlobalMethods()
  }

  thisContextFactory = (): GlobalThisContext => {
    const $resetReactive = this.InstanceService.ReactiveController.resetReactive
    const $changeState = this.InstanceService.StateController.changeCurrentState
    const $reactive = this.InstanceService.ReactiveController.ReactiveState

    return {
      $resetReactive,
      $changeState,
      $reactive,
    }
  }

  createObjectOfGlobalMethods = () => {
    const schema: GlobalObjectSchema = {}
    for (const methodName in this.InstanceService.machineSchema.global) {
      const method = this.InstanceService.machineSchema.global[methodName]
      const context = this.thisContextFactory()
      schema[methodName] = (...args: any[]) => {
        this.InstanceService.DebugController.logDebugMessage(`Executing global method ${methodName}`)
        return method.call(context, ...args)
      }
    }
    return schema
  }

  executeOnSchema = (machineSchema: MachineSchema) => {
    if (!machineSchema.global) return
    machineSchema.global = this.createObjectOfGlobalMethods()
  }
}
