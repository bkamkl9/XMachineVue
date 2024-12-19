# Global Actions

## Definition of Global Action
Global actions are methods defined outside of any specific state, allowing them to be accessible from any state within the state machine. They are similar to regular actions but are not tied to a particular state, providing a way to define behaviors that should be available universally across the state machine. This can be useful for actions that need to be executed regardless of the current state, such as logging, error handling, or global state changes.

```typescript
import { createMachine } from 'xmachinevue'

const machine = createMachine('some-machine', {
  initial: "INITIAL",
  state: {
    INITIAL: { /* (...) */ },
    AGREED: { /* (...) */ }
  },
  global: {
    logAction(message: string) {
      console.log(message)
    },
    resetMachine() {
      this.$changeState('INITIAL')

      this.$resetReactive()
    }
  }
})
```

## ⚠️ Returning reactive state from a global action
Due to typescript limitations, if you want to return reactive state from a global action, you have to specifically set the return type of it. Like in example below:

```typescript
const machine = createMachine('some-machine', {
  initial: "INITIAL",
  reactive: {
    counter: 1
  },
  global: {
    counterPlusOne(): number {
      this.$reactive.counter += 1
      return this.$reactive.counter
    }
  }
})
```

# Dispatching Global Actions
Global actions can be dispatched from any state. This provides flexibility in executing actions that are not state-specific.

Directly on the machine:
```typescript
machine.global.logAction('This is a global log message')
```

## State Transition from a Global Action
Global actions can also utilize the `$changeState` method to transition between states, similar to state-specific actions. They also can access reactive state `$reactive` and use `$resetReactive` method to reset reactive state.

```typescript{3}
actions: {
  resetMachine() {
    this.$changeState('INITIAL')
    this.$resetReactive()
  }
}
```

This structure allows you to define and use global actions effectively within your state machine, providing a consistent and flexible approach to handling actions that need to be accessible from any state.


ł