import { ShallowRef } from 'vue'
import { AnyObject } from '../../types/helper.types'
import { InstanceManager } from './instance.manager'

let instanceManager = new InstanceManager()

export function createMachine<Reactive extends AnyObject, Schema extends {}>(
  id: string,
  schema: XMACHINEVUE.MachineTemplate<Reactive, Schema>,
) {
  type KeyofStates = keyof (typeof schema)['states']
  const instanceService = instanceManager.createMachine(id, schema)

  return {
    resetReactive: instanceService.ReactiveController.ReactiveState,
    changeState: instanceService.StateController.changeCurrentState,
    currentState: instanceService.StateController.StateObserver.value as ShallowRef<KeyofStates>,
    ...schema.states,
  }
}

const type = createMachine('machine-id', {
  initial: 'HELLO',
  reactive: {},
  states: {
    HELLO: {
      hello(hello: string) {
        return 'hello' + hello
      },
    },
  },
})
