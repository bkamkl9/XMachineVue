import type { ShallowRef } from 'vue'
import type { RemoveThis, MethodToComputed } from '../../types/helper.types'
import { InstanceService } from './instance.service'

export function createMachine<R, S, G, C>(id: string, schema: XMACHINEVUE.MachineTemplate<R, S, G, C>) {
  type KeyofStates = keyof (typeof schema)['states']

  const instanceService = new InstanceService(schema as any, id)

  return {
    resetReactive: instanceService.ReactiveController.resetReactive,
    changeState: instanceService.StateController.changeCurrentState as (state: keyof S) => void,
    currentState: instanceService.StateController.StateObserver.target as ShallowRef<KeyofStates>,
    ...(schema.states as RemoveThis<S>),
    reactive: instanceService.ReactiveController.ReactiveState as R,
    global: schema.global as G,
    computed: schema.computed as MethodToComputed<C>,
  }
}
