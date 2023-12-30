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

  initialize = () => {
    this.StateObserver.set(this.InitialState)
  }

  changeCurrentState = (state: string) => {
    const { value: currentState } = this.StateObserver.value()
    if (currentState === state) console.log(`State is already set to ${currentState}`)
    else this.StateObserver.set(state)
  }
}
