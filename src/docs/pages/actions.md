# Actions

## Definition of action
Actions are methods defined in the states object. They are functions with a special this context and can accept any arguments. Actions allow you to define behaviors that should be executed when a certain state is active or when transitioning from one state to another. This could include anything from changing the state of the machine, dispatching other actions, or even side effects like making an API call or logging a message.

```typescript
import { createMachine } from 'xmachinevue'

const machine =  createMachine('counter-machine', {
  initial: "INITIAL",
  state: {
    INITIAL: {
      handleCheckboxClick(value: boolean) { /* (...) */}
      showConfirmModal() { /* (...) */ }
    },
    AGREED: { /* (...) */ }
  }
}) 
```

## Dispatching actions
You can dispatch only actions from certain active states. For example, if the current active state is 'INITIAL' you can dispatch only actions from this state, and you can do it in two ways.

Directly on the machine:
```typescript
machine.INITIAL.handleCheckboxClick(true)
```

or using this context of other action:
```typescript{3}
INITIAL: {
  handleCheckboxClick(value: boolean) {
    this.showConfirmModal()
  },
  showConfirmModal() { /* (...) */ }
}
```

## State transition from an action
Action this context contains the $changeState method, which allows you to transition to other states.

```typescript{3}
INITIAL: {
  handleCheckboxClick(value: boolean) {
    this.$changeState('AGREED')
  }
},
AGREED: { /* (...) */ }
```