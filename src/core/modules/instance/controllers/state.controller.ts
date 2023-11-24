import { InstanceService } from '../instance.service'
import { Observer } from '../../../utils/observer'

export class StateController {
  InstanceService: InstanceService
  InitialState: string
  StateObserver: Observer<string>

  constructor(InstanceService: InstanceService) {
    this.InstanceService = InstanceService
    this.InitialState = InstanceService.machineSchema.initial
    this.StateObserver = new Observer(InstanceService.machineSchema.initial)
  }

  public changeCurrentState(state: string) {
    this.StateObserver.set(state)
  }
}
