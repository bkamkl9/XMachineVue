import { createMachine } from '../index.ts'
import { expect, test, describe } from 'vitest'

localStorage.clear()

const localStorageId =  '__XMACHINE__.ID(localStorage.test.ts)'
const getInstance = () => JSON.parse(localStorage.getItem(localStorageId)!)

const machine = createMachine('localStorage.test.ts', {
  initial: 'STATE_1',
  useLocalStorage: true,
  reactive: {
    counter: 0
  },
  states: {
    STATE_1: {
      state_1_action_1() {
        this.$reactive.counter = 1
      },
      state_1_action_2() {
        this.$changeState('STATE_2')
      },
      state_1_action_3() {
        this.$resetReactive()
      }
    },
    STATE_2: {
      state_2_action_2() {
        this.$changeState('STATE_1')
      }
    }
  },
})


describe('Changing state', () => {
  test('Machine creates initial localStorage key', () => {
    const lsInstance = getInstance()
    expect(lsInstance.reactive.counter).toBe(0)
    expect(lsInstance.current).toBe('STATE_1')
  })

  test('Changing state from instance  is reflected in localStorage', () => {
    machine.changeState('STATE_2')
    const lsInstance = getInstance()
    expect(lsInstance.current).toBe('STATE_2')
  })

  test('Changing state from action is reflected in localStorage', () => {
    machine.changeState('STATE_2')
    machine.STATE_2.state_2_action_2()
    const lsInstance = getInstance()
    expect(lsInstance.current).toBe('STATE_1')
  })

  test('Changing reactive object from action is reflected in localStorage', () => {
    machine.changeState('STATE_1')
    machine.STATE_1.state_1_action_1()
    const lsInstance = getInstance()
    expect(lsInstance.reactive.counter).toBe(1)
  })

  test('Changing reactive object from instance is reflected in localStorage', () => {
    machine.reactive.counter = 2
    const lsInstance = getInstance()
    expect(lsInstance.reactive.counter).toBe(2)
  })

  test('Executing resetReactive from instance is reflected in localStorage', () => {
    machine.reactive.counter = 3
    machine.resetReactive()
    const lsInstance = getInstance()
    expect(lsInstance.reactive.counter).toBe(0)
  })

  test('Executing resetReactive from instance is reflected in localStorage', () => {
    machine.reactive.counter = 3
    machine.changeState('STATE_1')
    machine.STATE_1.state_1_action_3()
    const lsInstance = getInstance()
    expect(lsInstance.reactive.counter).toBe(0)
  })
})