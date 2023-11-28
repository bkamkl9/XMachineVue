# Quick start
## Import createMachine function
To create a new state machine, import the `createMachine` function from `xmachinevue`. In the first argument, specify the ID and in the second, define the body of the machine.

```typescript
import { createMachine } from "xmachinevue"
```

## Machine structure
The first parameter is a unique string with id of state machine. Second parameter is the body of the machine is an object with two required keys: "states" and "initial".

States, as the name suggests, are used for defining states. The states are objects that contain functions called actions. It's very similar to the Pinia syntax. The initial is a string for specifying which state should be loaded initially.

```typescript
const machine =  createMachine('agreement', {
  initial: "INITIAL",
  state: {
    INITIAL: {
      agree(name: string) {
        this.$changeState('AGREED')
        console.log(`${name} agreed`)
      }
    },
    AGREED: {
      goBack() {
        this.$changeState('INITIAL')
      }
    }
  }
})
```

## Use the State Machine
```typescript
machine.INITIAL.agree('Bob');
```
In this example, the agree action is called on the initial state, triggering a state change to "AGREED" and logging a message to the console.

This is just a basic introduction to get you started with xMachineVue. Explore the documentation for more advanced features, customization options, and best practices.