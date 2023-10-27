import { createMachine } from '../index.ts'
import { expect, test, describe } from 'vitest'

const machine = createMachine('reactive.test.ts', {
  initial: 'STATE_1',
  reactive: {
    count: 1,
    array: [1, 2, 3],
  },
  states: {
    STATE_1: {
      state_1_action_1(): number {
        return this.$reactive.count
      },
      state_1_action_2() {
        this.$reactive.count += 1
      },
      state_1_action_3() {
        this.$resetReactive()
      },
    },
  },
})

describe('Reactive object is accessible', () => {
  test('Actions can access reactive object', () => {
    const results = machine.STATE_1.state_1_action_1()
    expect(results).toBe(1)
  })

  test('Machine instance can access reactive object', () => {
    const results = machine.reactive.count
    expect(results).toBe(1)
  })

  test('Reactive object can be modified by actions', () => {
    machine.STATE_1.state_1_action_2()
    const results = machine.reactive.count
    expect(results).toBe(2)
  })

  test('Reactive object can be modified in machine instance', () => {
    machine.reactive.count += 1
    const results = machine.reactive.count
    expect(results).toBe(3)
  })
})

describe('Reset reactive property is working correctly', () => {
  test('Reset reactive property works on machine instance', () => {
    machine.reactive.count = 5
    Object.assign(machine.reactive, { count: 5, hello: 'string' })
    machine.resetReactive()
    expect(machine.reactive).toStrictEqual({ count: 1, array: [1, 2, 3] })
  })

  test('Reset reactive property works in actions', () => {
    machine.reactive.count = 5
    Object.assign(machine.reactive, { count: 5, hello: 'string' })
    machine.STATE_1.state_1_action_3()
    expect(machine.reactive).toStrictEqual({ count: 1, array: [1, 2, 3] })
  })
})
