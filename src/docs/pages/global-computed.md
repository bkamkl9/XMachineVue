# Global Computed Properties

## Definition of Global Computed Properties
Global computed properties are reactive computed values that can be defined at the machine level and accessed from any state. They provide a way to create derived state that depends on the machine's reactive state, similar to Vue's computed properties.

## Defining Global Computed Properties
Global computed properties are defined in the `computed` section of the machine configuration. They have read-only access to the machine's reactive state through `this.$reactive`.

```typescript
import { createMachine } from 'xmachinevue'

const machine = createMachine('todo-machine', {
  initial: "IDLE",
  reactive: {
    todos: [] as string[],
    filter: 'all' as 'all' | 'completed' | 'active'
  },
  state: {
    IDLE: { /* (...) */ }
  },
  computed: {
    filteredTodos() {
      const todos = this.$reactive.todos
      const filter = this.$reactive.filter

      if (filter === 'completed') {
        return todos.filter(todo => todo.completed)
      }
      if (filter === 'active') {
        return todos.filter(todo => !todo.completed)
      }
      return todos
    },
    todosCount() {
      return this.$reactive.todos.length
    }
  }
})
```

## ⚠️ Returning reactive state from a computed property
Due to typescript limitations, if you want to return reactive state from a computed property, you have to specifically set the return type of it. Like in example below:

```typescript
const machine = createMachine('some-machine', {
  initial: "INITIAL",
  reactive: {
    counter: 1
  },
  computed: {
    counterPlusOne(): number {
      return this.$reactive.counter + 1
    }
  }
})
```

## Accessing Global Computed Properties
Global computed properties can be accessed through the `computed` property of the machine instance. Since they are Vue computed properties, you need to use the `.value` property to access their current value:

```typescript
// Access the computed value
const filteredTodos = machine.computed.filteredTodos.value
const count = machine.computed.todosCount.value

// You can also watch computed properties
watch(() => machine.computed.filteredTodos.value, (newTodos) => {
  console.log('Filtered todos changed:', newTodos)
})
```

## Features and Limitations
- Computed properties are read-only and cannot modify the machine's state
- They automatically track their reactive dependencies and update when those dependencies change
- They can access the machine's reactive state through `this.$reactive`
- They cannot access or trigger state transitions
- They are cached and only re-evaluate when their dependencies change

## Use Cases
Global computed properties are particularly useful for:
- Filtering or transforming reactive data
- Calculating derived state that depends on multiple reactive values
- Creating reusable derived state that needs to be accessed from multiple states or components

This feature provides a powerful way to handle derived state in your state machine while maintaining reactivity and performance through caching. 