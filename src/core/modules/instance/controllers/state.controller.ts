import { Observer } from '../../../utils/observer'
import type { InstanceService } from '../instance.service'

export class StateController {
  InstanceService: InstanceService
  InitialState: string
  StateObserver: Observer<string | null>

  constructor(InstanceService: InstanceService) {
    this.InstanceService = InstanceService
    this.InitialState = InstanceService.machineSchema.initial
    this.StateObserver = new Observer(null as string | null)
  }

  changeCurrentState = (updatedState: string) => {
    const { value: currentState } = this.StateObserver.value()
    if (currentState === updatedState) {
      console.warn(`[XMachineVue] State is already set to ${updatedState}. Hooks won't be executed.`)
    } else {
      this.StateObserver.set(updatedState)
      this.InstanceService.DebugController.logDebugMessage(`State changed from ${currentState} to ${updatedState}`)
    }
  }

  quietChangeState = (state: string) => {
    this.InstanceService.DebugController.logDebugMessage(`State changed to initial state ${state}`)
    this.StateObserver.set(state)
  }
}
