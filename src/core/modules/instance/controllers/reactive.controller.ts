import { reactive } from 'vue'
import { InstanceService } from '../instance.service'
import { AnyObject } from '../../../types/helper.types'

export class ReactiveController {
  InstanceService: InstanceService
  InitialReactiveState: AnyObject
  ReactiveState: AnyObject

  constructor(InstanceService: InstanceService) {
    this.InstanceService = InstanceService
    this.InitialReactiveState = this.InstanceService.machineSchema.reactive
    this.ReactiveState = reactive(this.InstanceService.machineSchema.reactive)
  }

  public resetReactive() {}
}
