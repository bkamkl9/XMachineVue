import { defineMachine } from './dist/index'

const machine = defineMachine({
  state: () => ({}),
  states: {
    HELLO: {},
    THERE: {},
  },
  initial: '',
})

machine.changeState('HELLO')
