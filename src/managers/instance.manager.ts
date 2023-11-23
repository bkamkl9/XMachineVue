import { ActionController } from '../controllers/action.controller'
import { ReactiveController } from '../controllers/reactive.controller'
import { StateController } from '../controllers/state.controller'

export class InstanceManager {
  machineSchema: {}
  ActionController: ActionController
  ReactiveController: ReactiveController
  StateController: StateController

  constructor(MachineSchema: {}) {
    this.machineSchema = MachineSchema
    this.ActionController = new ActionController(this)
    this.ReactiveController = new ReactiveController(this)
    this.StateController = new StateController(this)
  }
}