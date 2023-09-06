# xMachineVue - Lightweight State Management Library for Vue 3

xMachineVue is a lightweight state management library designed for Vue 3
applications. It enables you to create state machines with dynamic states and
methods while providing TypeScript support and autocompletion.

## Installation

To use xMachineVue, you can install it via npm:

```bash
npm install xmachinevue
```

## Changelog

### 2.0.3

#### Bugs:

- Fixed bug in the documentation: changed `createMachine` to `defineMachine`

#### Features

- Added { initial: "{{state}}" } key to state machine

## Documentation

### Creating Your First State Machine

To create a new state machine, import the `defineMachine` function from
xMachineVue. Then, pass an object with two properties: `state` (a function
returning reactive state) and `states` (an object containing different states
and their associated methods).

```typescript
import { defineMachine } from 'xmachinevue'

const machine = defineMachine({
  state: () => ({ counter: 1 }),
  states: {
    INITIAL: {
      increment(amount = 1) {
        this.state.counter += amount;
        return this.state.counter;
      },
      decrement(amount = 1) {
        this.state.counter -= amount;
      },
    },
    INCREMENTED: {
      someAction(...args: any[]) { ... }
    },
  },
});
```

### Switching and Accessing the Current State

The `defineMachine` function returns an object with various keys. To access the
current state of the machine, you can use `.$current`:

```typescript
machine.$current; // Ref<'INITIAL' | 'INCREMENTED'>
machine.$current.value; // 'INITIAL' | 'INCREMENTED'
```

To change the state, use the `changeState` method, passing the name of the
desired state as a string:

```typescript
machine.changeState("INITIAL");
```

### Reactive State

To access the reactive state object of the machine, use `$state`. It contains a
reference to the reactive object returned by the state function. You can mutate
its properties or reset it to the initial value:

```typescript
machine.$state; // { counter: number }
machine.$state.counter = 2;
machine.resetState();
```

### Actions

Methods defined in the `states` object are called actions. Actions are functions
with special this context and can accept any arguments.

#### Dispatching an Action Outside Other Actions

To dispatch an action outside the state machine, you can use the `.from` method.
It accepts one argument, which is a string containing the name of the state from
which you want to get actions:

```typescript
machine.from("INITIAL"); // { increment: (amount?: number) => number, decrement: () => void }
machine.from("INITIAL").increment(5); // number
```

#### "this" Context of an Action

By accessing the `this` context within an action, you can directly dispatch
other actions from the current state, mutate, access and reset the reactive
state, or change to a different state:

```typescript
defineMachine({
  state: () => ({ counter: 0 }),
  states: {
    INITIAL: {
      action() {
        this.state.counter = 1;
        this.other("Counter changed");
        this.resetState();
        this.changeState("OTHER");
      },
      log(message: string) {
        console.log(message);
        return message;
      },
    },
    OTHER: {/* ... */},
  },
});
```

### onEnter and onLeave

There are two types of special actions executed automatically when
entering/leaving a state: `onEnter` and `onLeave`:

```typescript
const machine = defineMachine({
  state: () => ({/*...*/}),
  states: {
    STATE_ONE: {
      onEnter() {
        console.log("Entering STATE_ONE");
      },
      onLeave() {
        console.log("Leaving STATE_ONE");
      },
    },
  },
});

machine.changeState("STATE_ONE");
```

**Console Output:**

```bash
- 'Entering STATE_ONE'
- 'Leaving STATE_ONE'
```
