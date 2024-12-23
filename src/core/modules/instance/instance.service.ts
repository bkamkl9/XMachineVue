import type { AnyFunction, AnyObject } from '../../types/helper.types'
import { ActionController } from './controllers/action.controller'
import { LocalStorageController } from './controllers/localstorage.controller'
import { ReactiveController } from './controllers/reactive.controller'
import { StateController } from './controllers/state.controller'
import { DebugController } from './controllers/debug.controller'
import { GlobalController } from './controllers/global.controller'
import { ComputedController } from './controllers/computed.controller'
import type { ComputedRef } from 'vue'
export type MachineSchema = {
  debug?: boolean
  initial: string
  reactive?: AnyObject
  useLocalStorage?: boolean
  states: {
    [state in string]: {
      [action in string]: AnyFunction
    }
  }
  global?: {
    [action in string]: AnyFunction
  }
  computed?: {
    [action in string]: ComputedRef<any>
  }
}

export class InstanceService {
  machineSchema: MachineSchema
  machineId: string
  ActionController: ActionController
  ReactiveController: ReactiveController
  StateController: StateController
  DebugController: DebugController
  LocalStorageController: LocalStorageController
  GlobalController: GlobalController
  ComputedController: ComputedController

  constructor(MachineSchema: MachineSchema, id: string) {
    this.machineSchema = MachineSchema
    this.machineId = id
    this.StateController = new StateController(this)
    this.ReactiveController = new ReactiveController(this)
    this.ActionController = new ActionController(this)
    this.LocalStorageController = new LocalStorageController(this)
    this.DebugController = new DebugController(this)
    this.ActionController.listenForStateChangeHooks()
    this.GlobalController = new GlobalController(this)
    this.ComputedController = new ComputedController(this)

    this.GlobalController.executeOnSchema(this.machineSchema)
    this.ComputedController.executeOnSchema(this.machineSchema)
    if (this.machineSchema.useLocalStorage) this.LocalStorageController.initialize()
    else this.StateController.quietChangeState(this.machineSchema.initial)
  }
}
