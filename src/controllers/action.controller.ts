import { InstanceManager } from '../managers/instance.manager'
import { AnyFunction } from '../types/helper.types'

export class ActionController {
  InstanceManager: InstanceManager
  ActionsObject: XMACHINEVUE.ActionObjectSchema

  constructor(InstanceManager: InstanceManager) {
    this.InstanceManager = InstanceManager
    this.ActionsObject = this.createObjectOfActions()
  }

  private ThrowWrongStateErr(actionName: string, expectedState: string) {
    const currentState = this.InstanceManager.StateController.CurrentState.value
    throw new Error(`Action ${actionName} cannot be executed in ${currentState}. Expected state: ${expectedState}`)
  }

  private decorateWithStateGuard(method: AnyFunction, actionName: string, expectedState: string) {
    return (...args: any[]) => {
      const currentState = this.InstanceManager.StateController.CurrentState.value
      if (currentState !== expectedState) this.ThrowWrongStateErr(actionName, expectedState)
      return method(...args)
    }
  }

  private createObjectOfActions() {
    let schema = structuredClone(this.InstanceManager.machineSchema.states)
    for (const state in schema) {
      for (const action in schema[state]) {
        const method = schema[state][action]
        schema[state][action] = this.decorateWithStateGuard(method, action, state)
      }
    }
    return schema
  }
}
