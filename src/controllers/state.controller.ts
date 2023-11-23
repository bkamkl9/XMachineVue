import { InstanceManager } from '../managers/instance.manager'
import { Ref, ref } from 'vue'

export class StateController {
  InstanceManager: InstanceManager
  InitialState: string
  CurrentState: Ref<string>

  constructor(InstanceManager: InstanceManager) {
    this.InstanceManager = InstanceManager
    this.InitialState = InstanceManager.machineSchema.initial
    this.CurrentState = ref(InstanceManager.machineSchema.initial)
  }
}
