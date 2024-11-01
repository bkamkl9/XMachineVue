import type { AnyFunction, AnyObject } from '../../../types/helper.types'
import type { InstanceService } from '../instance.service'

interface ActionThisContext {
  $resetReactive: AnyFunction
  $changeState: AnyFunction
  $reactive: AnyObject
}

export class ActionController {
  InstanceService: InstanceService
  ActionsObject: XMACHINEVUE.ActionObjectSchema

  constructor(InstanceService: InstanceService) {
    this.InstanceService = InstanceService
    this.ActionsObject = this.createObjectOfActions()
  }

  listenForStateChangeHooks = () => {
    this.InstanceService.StateController.StateObserver.subscribe((previous, updated) => {
      if (updated)
        if ('$onEnter' in this.ActionsObject[updated]) this.ActionsObject[updated]?.$onEnter?.(previous, updated)
      if (previous)
        if ('$onLeave' in this.ActionsObject[previous]) this.ActionsObject[previous]?.$onLeave?.(previous, updated)
    })
  }

  thisContextFactory = (state: string): ActionThisContext => {
    return {
      $resetReactive: this.InstanceService.ReactiveController.resetReactive,
      $changeState: this.InstanceService.StateController.changeCurrentState,
      $reactive: this.InstanceService.ReactiveController.ReactiveState,
      ...this.ActionsObject[state],
    }
  }

  ThrowWrongStateErr = (actionName: string, expectedState: string) => {
    const currentState = this.InstanceService.StateController.StateObserver.get()
    throw new Error(`Action ${actionName} cannot be executed in ${currentState}. Expected state: ${expectedState}`)
  }

  decorateWithStateGuard = (method: AnyFunction, actionName: string, expectedState: string) => {
    return (...args: any[]) => {
      const isHook = ['$onEnter', '$onLeave'].includes(actionName)
      const currentState = this.InstanceService.StateController.StateObserver.get()
      if (!isHook && currentState !== expectedState) this.ThrowWrongStateErr(actionName, expectedState)

      const context = this.thisContextFactory(expectedState)
      this.InstanceService.DebugController.logDebugMessage(`Executing action ${actionName} in state ${expectedState}`)
      return method.call(context, ...args)
    }
  }

  createObjectOfActions = () => {
    const schema = { ...this.InstanceService.machineSchema.states }
    for (const state in schema) {
      for (const action in schema[state]) {
        const method = schema[state][action]
        schema[state][action] = this.decorateWithStateGuard(method, action, state)
      }
    }
    return schema
  }
}
