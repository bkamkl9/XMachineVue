
# States
## Machine body
The body of the machine is an object with two required keys: "states" and "initial".

States, as the name suggests, are used for defining states. The states are objects that contain functions called actions. It's very similar to the Pinia syntax. The initial is a string for specifying which state should be loaded initially.

```typescript
const machine =  createMachine('agreement', {
  initial: "INITIAL",
  state: {
    INITIAL: {
      agree(name: string) {
        this.$changeState('AGREED')
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

## Getting reactive state
Under `machine.current` is a reactive shallow ref with current machine state can be accessed. In the above example, the value is "INITIAL"

```typescript
machine.current.value // "INITIAL" | "AGREED"
```

### State transitions
There are two ways of transitioning to a different state.

We can use `$changeState('STATE_KEY')` from action context object.
```typescript{6}
createMachine('agreement', {
  initial: "INITIAL",
  state: {
    INITIAL: {
      action(name: string) {
        this.$changeState('AGREED')
      }
    },
    AGREED: {
      /* ... */
    }
  }
})
```

or directly call `changeState('STATE_KEY')` on machine.
```typescript{1}
machine.changeState('AGREED')
machine.current.value // "AGREED"
```
