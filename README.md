## Introduction
The xMachineVue library combines concept of a state machine with a reactive store. By combining these two concepts, it allows you to manage your application’s state in a structured and predictable way. It provides you with the ability to define different states and transitions between them, while also allowing you to reactively track changes to your application’s state. This makes it easier to manage complex state logic in Vue.js applications.

### Installation
To use xMachineVue, you can install it via npm:

```bash
npm install xmachinevue
```

### Creating a new machine
To create a new state machine, import the `createMachine` function from `xmachinevue`. In the first argument, specify the ID and in the second, define the body of the machine.

### Machine structure
The body of the machine is an object with two required keys: "states" and "initial".

States, as the name suggests, are used for defining states. The states are objects that contain functions called actions. It's very similar to the Pinia syntax. The initial is a string for specifying which state should be loaded initially.

```typescript
import { createMachine } from 'xmachinevue'

const machine =  createMachine('agreement', {
  initial: "INITIAL",
  state: {
    INITIAL: { /* (...) */ },
    AGREED: { /* (...) */ }
  }
}) 
```

Under `machine.current.value` is a reactive ref with current machine state can be accessed. In the above example, the value is "INITIAL"

### State transitions
There are two ways of transitioning to a different state. We can directly call `changeState('STATE_KEY')` on machine or use `$changeState('STATE_KEY')` from action context.

```typescript
machine.changeState('AGREED')
machine.current.value // "AGREED"
```

### Actions
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

### Dispatching actions
You can dispatch only actions from certain active states. For example, if the current active state is 'INITIAL' you can dispatch only actions from this state, and you can do it in two ways.

Directly on the machine:

```typescript
machine.INITIAL.handleCheckboxClick(true)
```
or using this context of other action:

```typescript
INITIAL: {
  handleCheckboxClick(value: boolean) {
    this.showConfirmModal()
  },
  showConfirmModal() { /* (...) */ }
}
```

### State transition from an action
Action this context contains the `$changeState` method, which allows you to transition to other states.

```typescript
INITIAL: {
  handleCheckboxClick(value: boolean) {
    this.$changeState('AGREED')
  }
},
AGREED: { /* (...) */ }
```

### State transition hooks
`$onEnter` and `$onLeave` are special actions that are automatically executed when entering or leaving a state. They are essentially hooks that allow you to perform certain actions or side effects during the state transitions.

- `$onEnter`: This hook is called when the machine enters a new state. You can use this hook to perform setup actions or to log that a new state has been entered. For example, `onEnter() { console.log("Entering STATE_ONE"); }` would log "Entering STATE_ONE" whenever the machine transitions into the "STATE_ONE" state.

- `$onLeave`: This hook is called when the machine is about to leave a state. You can use this hook to perform cleanup actions or to log that a state is being exited. For example, `onLeave() { console.log("Leaving STATE_ONE"); }` would log "Leaving STATE_ONE" whenever the machine transitions out of the "STATE_ONE" state¹.

```typescript
const machine =  createMachine('counter-machine', {
  initial: "INITIAL",
  state: {
    INITIAL: {
      $onEnter() {
        console.log('Entering state "INITIAL"')
      },
      $onLeave() {
        console.log('Leaving state "INITIAL"')
      }
    },
    AGREED: { /* (...) */ }
  }
})

machine.changeState('AGREED')
```

console output:

```bash
Entering state "INITIAL"
Leaving state "INITIAL"
```

### Reactive object
It’s an object that holds the mutable state of your application and is made reactive by Vue.js. This means that Vue.js can automatically track changes to this state and update the DOM when the state changes. In order to use it, add a new "reactive" key to your machine structure.

```typescript
const machine =  createMachine('counter-machine', {
  initial: "INITIAL",
  reactive: {
    checkbox_checked: false,
    times_clicked: 0
  },
  state: {
    INITIAL: {
      handleCheckboxClick(value: boolean) { /* (...) */}
      showConfirmModal() { /* (...) */ }
    },
    AGREED: { /* (...) */ }
  }
}) 
```

You can read and mutate reactive object directly from the machine:

```typescript
machine.reactive.times_clicked += 1
```

or using this context of some action:

```typescript
INITIAL: {
  handleCheckboxClick(value: boolean) {
    this.$reactive.checkbox_checked = value
  },
  showConfirmModal() { /* (...) */ }
}
```

### ⚠️ Returning reactive state from an action
Due to typescript limitations, if you want to return reactive state from an action, you have to specifically set the return type of it. Example:

```typescript
const machine = createMachine('some-machine', {
  initial: "INITIAL",
  reactive: {
    counter: 1
  },
  states: {
    increment(num: number): number {
      this.$reactive.counter += number
      return this.$reactive.counter
    }
  }
});
```

### Resetting reactive to its initial state
To reset reactive to its initial state, you can either call `this.$resetReactive()` in some action or call `machine.resetReactive()` directly on the machine.

### Preserving the state with the LocalStorage API
The `useLocalStorage` option in `xMachineVue` allows you to persist the state of your machine in the browser's local storage. This can be particularly useful if you want to maintain state across browser sessions or refreshes.

When you initialize your machine, you can set `useLocalStorage: true` to enable this feature. Here's an example:

```typescript
const machine = createMachine('some-machine', {
  useLocalStorage: true,
  /* (...) */
});
```

When `useLocalStorage` is set to `true`, the state of the machine and any reactive objects are stored in local storage. The key used for storing this data is `__XMACHINE__.ID(<machine id>)`, where `<machine id>` is the ID of your machine (in this case, 'some-machine').

This means that even if the user closes the browser or refreshes the page, the state of the machine will be preserved and can be reloaded the next time the page is opened. This can be very useful for maintaining user progress or settings across sessions.

---

### Migration guide from 2.X to 3.X

If you want to migrate to newer version check out migration guide: https://github.com/KamilBartczak03/XMachineVue/blob/main/MIGRATION_GUIDE.md

### Changelog

If you want to check out the changelog go to github: https://github.com/KamilBartczak03/XMachineVue/blob/main/CHANGELOG.md