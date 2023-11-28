# Reactive state
## Reactive object
It’s an object that holds the mutable state of your application and is made reactive by Vue.js. This means that Vue.js can automatically track changes to this state and update the DOM when the state changes. In order to use it, add a new "reactive" key to your machine structure.

```typescript{3-6}
const machine =  createMachine('counter-machine', {
  initial: "INITIAL",
  reactive: {
    checkbox_checked: false,
    times_clicked: 0
  },
  state: {
    INITIAL: { /* (...) */ },
    AGREED: { /* (...) */ }
  }
}) 
```

You can read and mutate reactive object directly from the machine:

```typescript
machine.reactive.times_clicked += 1
```

or using `this` context of some action:

```typescript{3}
INITIAL: {
  handleCheckboxClick(value: boolean) {
    this.$reactive.checkbox_checked = value
  },
  showConfirmModal() { /* (...) */ }
}
```
## ⚠️ Returning reactive state from an action
Due to typescript limitations, if you want to return reactive state from an action, you have to specifically set the return type of it. Like in example below:

```typescript{7}
createMachine('some-machine', {
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

## Resetting reactive to its initial state
To reset reactive to its initial state, you can either call `this.$resetReactive()` in some action

```typescript{8}
const machine = createMachine('some-machine', {
  initial: "INITIAL",
  reactive: {
    counter: 1
  },
  states: {
    reset() {
      this.$resetReactive()
    }
  }
});
```
or directly on machine instance
```typescript
machine.resetReactive()
```