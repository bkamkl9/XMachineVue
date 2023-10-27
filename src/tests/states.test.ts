import { createMachine } from '../index.ts'
import { expect, test, describe } from 'vitest'

const machine = createMachine('states.test.ts', {
  initial: 'STATE_1',
  reactive: {
    enter: 'initial',
    leave: 'initial'
  },
  states: {
    STATE_1: {
      $onEnter() {
        this.$reactive.enter = 'STATE_1'
      },
      $onLeave() {
        this.$reactive.leave = 'STATE_1'
      },
      state_1_action_1() {
        return "STATE_1"
      },
      state_1_action_2() {
        this.$changeState('STATE_2')
      }
    },
    STATE_2: {
      $onEnter() {
        this.$reactive.enter = 'STATE_2'
      },
      $onLeave() {
        this.$reactive.leave = 'STATE_2'
      },
      state_2_action_1() {
        return "STATE_2"
      },
      state_2_action_2() {
        this.$changeState('STATE_1')
      }
    }
  },
})

describe('Changing state', () => {
  test('Initial state is assigned', () => {
    expect(machine.current.value).toBe('STATE_1')
  })

  test('Machine instance can change state', () => {
    machine.changeState('STATE_2')
    expect(machine.current.value).toBe('STATE_2')
    expect(machine.STATE_2.state_2_action_1()).toBe('STATE_2')
  })

  test('Machine action can change state', () => {
    machine.changeState('STATE_2')
    machine.STATE_2.state_2_action_2()
    expect(machine.current.value).toBe('STATE_1')
    expect(machine.STATE_1.state_1_action_1()).toBe('STATE_1')
  })
})

describe('On enter and on leave functionality', () => {
  test('Initial state assignment triggers $onEnter', () => {
    expect(machine.reactive.enter).toBe('STATE_1')
  })

  test('Hooks are executed when changing state from machine instance', () => {
    machine.changeState('STATE_2')
    expect(machine.reactive.enter).toBe('STATE_2')
    expect(machine.reactive.leave).toBe('STATE_1')
  })

  test('Hooks are executed when changing state from machine actions', () => {
    machine.STATE_2.state_2_action_2()
    expect(machine.reactive.leave).toBe('STATE_2')
    expect(machine.reactive.enter).toBe('STATE_1')
  })
})