import { createMachine } from './src/index'

const machine = createMachine({
  state: () => ({
    somestate: 1,
  }),
  actions: {
    INITIAL: {
      initial() {},
      initial2() {},
    },
    LOADING: {
      loading(message: string) {
        this.changeState('dasdas')
      },
    },
  },
})

machine.dispatch<'INITIAL'>('initial2')
machine.changeState('LOADING')
