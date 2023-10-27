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

### 3.0.0 !!! Breaking Changes !!!

- **Feature:** Added `useLocalStorage` flag for preserving state and reactive object in LocalStorage
- **Feature:** Added unit test to te repository

### 2.0.3

- **Bug** Fixed bug in the documentation: changed `defineMachine` to `createMachine`
- **Features** Added { initial: "{{state}}" } key to state machine

## Migrating from 2.0.3 to 3.0.0

1. **Reactive object definition**

- Way of defining reactive state has changed from `state: () => ({ ... })` to `reactive: { ... }`

2. **Executing actions**

- Executing actions from machine instance no longer uses `.from()` method. Instead actions are directly called from the state key like this: `machine.INITIAL.increment(1)`

3. **Action context has been changed**

- `this.$state` to `this.$reactive`
- `this.changeState` to `this.$changeState`
- `this.resetState` to `this.$resetReactive`

4. **Machine instance method has been changed**

- `this.$state` to `this.reactive`
- `this.$changeState` to `this.changeState`
- `this.$resetState` to `this.resetReactive`

5. **onEnter and onLeave hooks has been renamed**

- `onEnter` hook has been renamed to `$onEnter`
- `onLeave` hook has been renamed to `$onLeave`

6. **Initial state key is required while defining machine**

- adding `initial: string` key to machine is now required.

## Documentation < 3.0.0

### Creating Your First State Machine

To create a new state machine, import the `createMachine` function from
xMachineVue. Then, pass an object with two properties: `state` (a function
returning reactive state) and `states` (an object containing different states
and their associated methods). You also have to include initial state

```typescript
import { createMachine } from 'xmachinevue'

const machine = createMachine({
  initial: 'INITIAL',
  reactive: {
    counter: 1
  },
  states: {
    INITIAL: {
      increment(amount = 1): number {
        this.reactive.counter += amount;
        return this.reactive.counter;
      },
      decrement(amount = 1) {
        this.reactive.counter -= amount;
      },
    },
    INCREMENTED: {
      someAction(...args: any[]) { ... }
    },
  },
});
```

### Switching and Accessing the Current State

The `createMachine` function returns an object with various keys. To access the
current state of the machine, you can use `.$current`:

```typescript
machine.current // Ref<'INITIAL' | 'INCREMENTED'>
machine.current.value // 'INITIAL' | 'INCREMENTED'
```

To change the state, use the `changeState` method, passing the name of the
desired state as a string:

```typescript
machine.changeState('INITIAL')
```

### Reactive State

To access the reactive state object of the machine use `reactive`. It contains a reference to the reactive object. You can mutate its properties or reset it to the initial value:

```typescript
machine.reactive // { counter: number }
machine.reactive.counter = 2
machine.$resetReactive()
```

### Actions

Methods defined in the `states` object under some key are called actions. Actions are functions
with special this context and can accept any arguments.

#### Dispatching an Action Outside Other Actions

To dispatch an action outside the state machine, you can use the `machine.<STATE_KEY>.<ACTION_KEY>()` method.
It accepts one argument, which is a string containing the name of the state from
which you want to get actions:

```typescript
machine.INITIAL // { increment: (amount?: number) => number, decrement: () => void }
machine.INITIAL.increment(5) // number
```

#### Returning reactive state from action

If you want to return reactive state from an action method you have to specifically set return type of the function like in example below:

```typescript
{
  INITIAL: {
    getValueFromReactive(): number {
      return this.reactive.counter
    }
  }
}
```

#### "this" Context of an Action

By accessing the `this` context within an action, you can directly dispatch
other actions from the current state, mutate, access and reset the reactive
state, or change to a different machine state:

```typescript
createMachine({
  reactive: {}.
  states: {
    INITIAL: {
      action() {
        this.$reactive.counter = 1;
        this.$resetReactive();
        this.$changeState("OTHER");
        this.otherAction("Counter changed") // string;
      },
      otherAction(message: string) {
        console.log(message);
        return message;
      },
    },
    OTHER: {/* ... */},
  },
});
```

#### onEnter and onLeave

There are two types of special actions executed automatically when
entering/leaving a state: `onEnter` and `onLeave`:

```typescript
const machine = createMachine({
  reactive: {},
  initial: 'STATE_ONE',
  states: {
    STATE_ONE: {
      $onEnter() {
        console.log('Entering STATE_ONE')
      },
      $onLeave() {
        console.log('Leaving STATE_ONE')
      },
    },
  },
})
```

**Console Output:**

```bash
- 'Entering STATE_ONE'
```

### useLocalStorage

If you want to preserve machine state in localStorage you can do it by setting `useLocalStorage: true` flag while initialization.

```typescript
const machine = createMachine('some-machine', {
  useLocalStorage: true,
  (...)
})
```

Reactive objects and machine state is saved is preserved in localStorage under this key: `__XMACHINE__.ID(<machine id>)`
