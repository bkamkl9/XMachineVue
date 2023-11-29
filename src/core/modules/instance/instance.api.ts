import { ShallowRef } from 'vue'
import { InstanceManager } from './instance.manager'
import { RemoveThis } from '../../types/helper.types'

let instanceManager = new InstanceManager()

export function createMachine<R, S>(id: string, schema: XMACHINEVUE.MachineTemplate<R, S>) {
  type KeyofStates = keyof (typeof schema)['states']
  const instanceService = instanceManager.createMachine(id, schema)

  return {
    resetReactive: instanceService.ReactiveController.ReactiveState,
    changeState: instanceService.StateController.changeCurrentState,
    currentState: instanceService.StateController.StateObserver.target as ShallowRef<KeyofStates>,
    ...(schema.states as RemoveThis<S>),
  }
}
