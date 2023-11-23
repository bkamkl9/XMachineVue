import { InstanceManager } from '../managers/instance.manager'
import { Observer } from '../utils/observer'

export class StateController {
  InstanceManager: InstanceManager
  InitialState: string
  StateObserver: Observer<string>

  constructor(InstanceManager: InstanceManager) {
    this.InstanceManager = InstanceManager
    this.InitialState = InstanceManager.machineSchema.initial
    this.StateObserver = new Observer(InstanceManager.machineSchema.initial)
  }

  public changeCurrentState(state: string) {
    this.StateObserver.set(state)
  }
}
