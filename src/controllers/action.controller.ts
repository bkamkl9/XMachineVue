import { InstanceService } from '../services/instance.service'
import { AnyFunction } from '../types/helper.types'

export class ActionController {
  InstanceService: InstanceService
  ActionsObject: XMACHINEVUE.ActionObjectSchema

  constructor(InstanceService: InstanceService) {
    this.InstanceService = InstanceService
    this.ActionsObject = this.createObjectOfActions()
    this.listenForStateChangeHooks()
  }

  private listenForStateChangeHooks() {
    this.InstanceService.StateController.StateObserver.subscribe((updated, previous) => {
      if ('onLeave' in this.ActionsObject[previous]) this.ActionsObject[previous].onLeave(previous, updated)
      if ('onEnter' in this.ActionsObject[updated]) this.ActionsObject[updated].onEnter(previous, updated)
    })
  }

  private thisContextFactory(state: string): XMACHINEVUE.ActionThisContext {
    return {
      $resetReactive: this.InstanceService.ReactiveController.resetReactive,
      $changeState: this.InstanceService.StateController.changeCurrentState,
      $reactive: this.InstanceService.ReactiveController.ReactiveState,
      ...this.ActionsObject[state],
    }
  }

  private ThrowWrongStateErr(actionName: string, expectedState: string) {
    const currentState = this.InstanceService.StateController.StateObserver.get()
    throw new Error(`Action ${actionName} cannot be executed in ${currentState}. Expected state: ${expectedState}`)
  }

  private decorateWithStateGuard(method: AnyFunction, actionName: string, expectedState: string) {
    return (...args: any[]) => {
      const currentState = this.InstanceService.StateController.StateObserver.get()
      if (currentState !== expectedState) this.ThrowWrongStateErr(actionName, expectedState)

      const context = this.thisContextFactory(expectedState)
      return method.call(context, ...args)
    }
  }

  private createObjectOfActions() {
    let schema = structuredClone(this.InstanceService.machineSchema.states)
    for (const state in schema) {
      for (const action in schema[state]) {
        const method = schema[state][action]
        schema[state][action] = this.decorateWithStateGuard(method, action, state)
      }
    }
    return schema
  }
}
