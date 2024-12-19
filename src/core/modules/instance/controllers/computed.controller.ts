import type { InstanceService } from '../instance.service'
import type { AnyFunction, AnyObject } from '../../../types/helper.types'
import type { MachineSchema } from '../instance.service'
import { computed } from 'vue'
import type { ComputedRef } from 'vue'

interface ComputedThisContext {
  $resetReactive: AnyFunction
  $changeState: AnyFunction
  $reactive: AnyObject
}

interface ComputedObjectSchema {
  [key: string]: ComputedRef<any>
}

export class ComputedController {
  InstanceService: InstanceService
  ComputedObject: ComputedObjectSchema

  constructor(InstanceService: InstanceService) {
    this.InstanceService = InstanceService
    this.ComputedObject = this.createObjectOfComputedMethods()
  }

  thisContextFactory = (): ComputedThisContext => {
    const $resetReactive = this.InstanceService.ReactiveController.resetReactive
    const $changeState = this.InstanceService.StateController.changeCurrentState
    const $reactive = this.InstanceService.ReactiveController.ReactiveState

    return {
      $resetReactive,
      $changeState,
      $reactive,
    }
  }

  createObjectOfComputedMethods = () => {
    const schema: ComputedObjectSchema = {}
    for (const methodName in this.InstanceService.machineSchema.computed) {
      const method = this.InstanceService.machineSchema.computed[methodName] as unknown as AnyFunction
      const context = this.thisContextFactory()
      schema[methodName] = computed(() => method.bind(context)())
    }
    return schema
  }

  executeOnSchema = (machineSchema: MachineSchema) => {
    if (!machineSchema.computed) return
    machineSchema.computed = this.createObjectOfComputedMethods()
  }
}
