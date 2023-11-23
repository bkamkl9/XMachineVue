import { reactive } from 'vue'
import { InstanceManager } from '../managers/instance.manager'
import { AnyObject } from '../types/helper.types'

export class ReactiveController {
  InstanceManager: InstanceManager
  InitialReactiveState: AnyObject
  ReactiveState: AnyObject

  constructor(InstanceManager: InstanceManager) {
    this.InstanceManager = InstanceManager
    this.InitialReactiveState = this.InstanceManager.machineSchema.reactive
    this.ReactiveState = reactive(this.InstanceManager.machineSchema.reactive)
  }
}
