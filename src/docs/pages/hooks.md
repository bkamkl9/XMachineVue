# Hooks
## State transition hooks
`$onEnter` and `$onLeave` are special actions that are automatically executed when entering or leaving a state. They are essentially hooks that allow you to perform certain actions or side effects during the state transitions.

- `$onEnter`: This hook is called when the machine enters a new state. You can use this hook to perform setup actions or to log that a new state has been entered. For example, `$onEnter() { console.log("Entering STATE_ONE"); }` would log "Entering STATE_ONE" whenever the machine transitions into the "STATE_ONE" state.

- `$onLeave`: This hook is called when the machine is about to leave a state. You can use this hook to perform cleanup actions or to log that a state is being exited. For example, `$onLeave() { console.log("Leaving STATE_ONE"); }` would log "Leaving STATE_ONE" whenever the machine transitions out of the "STATE_ONE" state¹.

```typescript{5-10}
const machine =  createMachine('counter-machine', {
  initial: "INITIAL",
  state: {
    INITIAL: {
      $onEnter(from: string, to: string) {
        console.log(`Entering ${to}, leaving: ${from}`)
      },
      $onLeave(from: string, to: string) {
        console.log(`Leaving ${from}, entering: ${to}`)
      }
    },
    AGREED: { /* (...) */ }
  }
})

machine.changeState('AGREED')
```

console output:

```bash
> Leaving "INITIAL", entering: "AGREED"
> Entering "AGREED", leaving: "INITIAL"
```