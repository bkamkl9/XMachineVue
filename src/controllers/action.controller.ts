import { InstanceManager } from '../managers/instance.manager'
import { AnyFunction } from '../types/helper.types'

export class ActionController {
  InstanceManager: InstanceManager
  ActionsObject: XMACHINEVUE.MachineSchema['states']

  constructor(InstanceManager: InstanceManager) {
    this.InstanceManager = InstanceManager
    this.ActionsObject = this.createObjectOfActions()
  }

  private createObjectOfActions() {
    let schema = structuredClone(this.InstanceManager.machineSchema.states)

    for (const state in schema) {
      for (const action in schema[state]) {
        // TODO: create wrapper function
        // TODO: assign context object
        schema[state][action] = schema[state][action]
      }
    }

    return schema
  }
}
