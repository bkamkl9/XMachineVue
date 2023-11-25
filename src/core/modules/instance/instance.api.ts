import { AnyObject } from '../../types/helper.types'
import { InstanceManager } from './instance.manager'

let instanceManager = new InstanceManager()

export function createMachine<Reactive extends AnyObject, Schema extends {}>(
  id: string,
  schema: XMACHINEVUE.MachineTemplate<Reactive, Schema>,
) {
  instanceManager.createMachine(id, schema)

  return schema
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
    THERE: {
      cotam() {
        return 'nie wiem'
      },
    },
  },
})
