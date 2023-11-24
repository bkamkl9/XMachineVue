import { InstanceManager } from '../managers/instance.manager'
import { AnyFunction } from '../types/helper.types'

export class ActionController {
  InstanceManager: InstanceManager
  ActionsObject: XMACHINEVUE.ActionObjectSchema

  constructor(InstanceManager: InstanceManager) {
    this.InstanceManager = InstanceManager
    this.ActionsObject = this.createObjectOfActions()
    this.listenForStateChangeHooks()
  }

  private listenForStateChangeHooks() {
    this.InstanceManager.StateController.StateObserver.subscribe((updated, previous) => {
      if ('onLeave' in this.ActionsObject[previous]) this.ActionsObject[previous].onLeave(previous, updated)
      if ('onEnter' in this.ActionsObject[updated]) this.ActionsObject[updated].onEnter(previous, updated)
    })
  }

  private thisContextFactory(state: string): XMACHINEVUE.ActionThisContext {
    return {
      $resetReactive: this.InstanceManager.ReactiveController.resetReactive,
      $changeState: this.InstanceManager.StateController.changeCurrentState,
      $reactive: this.InstanceManager.ReactiveController.ReactiveState,
      ...this.ActionsObject[state],
    }
  }

  private ThrowWrongStateErr(actionName: string, expectedState: string) {
    const currentState = this.InstanceManager.StateController.StateObserver.get()
    throw new Error(`Action ${actionName} cannot be executed in ${currentState}. Expected state: ${expectedState}`)
  }

  private decorateWithStateGuard(method: AnyFunction, actionName: string, expectedState: string) {
    return (...args: any[]) => {
      const currentState = this.InstanceManager.StateController.StateObserver.get()
      if (currentState !== expectedState) this.ThrowWrongStateErr(actionName, expectedState)

      const context = this.thisContextFactory(expectedState)
      return method.call(context, ...args)
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
