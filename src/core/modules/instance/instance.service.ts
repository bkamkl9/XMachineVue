import type { AnyFunction, AnyObject } from '../../types/helper.types'
import { ActionController } from './controllers/action.controller'
import { ReactiveController } from './controllers/reactive.controller'
import { StateController } from './controllers/state.controller'

type MachineSchema = {
  initial: string
  reactive: AnyObject
  states: {
    [state in string]: {
      [action in string]: AnyFunction
    }
  }
}

export class InstanceService {
  machineSchema: MachineSchema
  machineId: string
  ActionController: ActionController
  ReactiveController: ReactiveController
  StateController: StateController

  constructor(MachineSchema: MachineSchema, id: string) {
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
