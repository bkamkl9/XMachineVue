import { createMachine } from '../index.ts'
import { expect, test, describe } from 'vitest'

const machine = createMachine('actions.test.ts', {
  initial: 'STATE_1',
  states: {
    STATE_1: {
      state_1_action_1() {
        return this.state_1_action_2()
      },
      state_1_action_2() {
        return 'state_1_action_2'
      },
      state_1_action_3() {
        return this
      },
    },
    STATE_2: {
      state_2_action_1() {},
    },
  },
})

describe('Actions has correct this context', () => {
  test('Action can execute other actions', () => {
    expect(machine.STATE_1.state_1_action_1()).toBe('state_1_action_2')
  })

  test('Action context contains all properties', () => {
    const ctx = machine.STATE_1.state_1_action_3() as any
    const results = Object.keys(ctx)
    const expected = [
      '$reactive',
      '$changeState',
      '$resetReactive',
      'state_1_action_1',
      'state_1_action_2',
      'state_1_action_3',
    ]
    expect(results).toStrictEqual(expected)
  })
})
