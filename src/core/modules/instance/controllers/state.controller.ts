import { InstanceService } from '../instance.service'
import { Observer } from '../../../utils/observer'

export class StateController {
  InstanceService: InstanceService
  InitialState: string
  StateObserver: Observer<string | null>

  constructor(InstanceService: InstanceService) {
    this.InstanceService = InstanceService
    this.InitialState = InstanceService.machineSchema.initial
    this.StateObserver = new Observer(null as string | null)
  }

  changeCurrentState = (state: string) => {
    const { value: currentState } = this.StateObserver.value()
    if (currentState === state) console.warn(`[XMachineVue] State is already set to ${state}. Hooks won't be executed.`)
    else this.StateObserver.set(state)
  }

  quietChangeState = (state: string) => {
    this.StateObserver.target.value = state
    this.StateObserver.set(state)
  }
}
