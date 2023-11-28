import type { AnyFunction, AnyObject } from '../../types/helper.types'
import { ActionController } from './controllers/action.controller'
import { LocalStorageController } from './controllers/localstorage.controller'
import { ReactiveController } from './controllers/reactive.controller'
import { StateController } from './controllers/state.controller'

type MachineSchema = {
  initial: string
  reactive?: AnyObject
  useLocalStorage?: boolean
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
  LocalStorageController: LocalStorageController

  constructor(MachineSchema: MachineSchema, id: string) {
    this.machineSchema = MachineSchema
    this.machineId = id
    this.ActionController = new ActionController(this)
    this.ReactiveController = new ReactiveController(this)
    this.StateController = new StateController(this)
    this.LocalStorageController = new LocalStorageController(this)
  }
}
