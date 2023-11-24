import { ActionController } from '../controllers/action.controller'
import { ReactiveController } from '../controllers/reactive.controller'
import { StateController } from '../controllers/state.controller'

export class InstanceService {
  machineSchema: XMACHINEVUE.MachineSchema
  machineId: string
  ActionController: ActionController
  ReactiveController: ReactiveController
  StateController: StateController

  constructor(MachineSchema: XMACHINEVUE.MachineSchema, id: string) {
    this.machineSchema = MachineSchema
    this.ActionController = new ActionController(this)
    this.ReactiveController = new ReactiveController(this)
    this.StateController = new StateController(this)
    this.machineId = this.createMachineId(id)
  }

  private createMachineId(id: string) {
    return id
  }
}
