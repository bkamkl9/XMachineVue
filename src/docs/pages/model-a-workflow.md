# Model a workflow

Model modes, not every value. If a component can be editing, submitting, failed, or complete, those are states. A state declares the events it accepts; an event chooses a target through a transition.

```ts
type Event = { type: 'SUBMIT' } | { type: 'EDIT' } | { type: 'RETRY' }

const form = defineMachine<FormContext, Event>()({
  context: () => ({ values: emptyForm(), error: null }),
  initial: 'editing',
  guards: {
    valid: (context) => context.values.email.includes('@'),
  },
  states: {
    editing: { on: { SUBMIT: { target: 'submitting', guard: 'valid' } } },
    submitting: {},
    failure: { on: { EDIT: 'editing', RETRY: 'submitting' } },
    complete: {},
  },
})
```

Use `can(event)` to drive disabled controls. A guarded transition is unavailable when its guard returns false. A target must name a declared state; XMachineVue rejects invalid initial and target states.

## Context updates and effects

Context is not writable from templates. Update it from an action with `assign`:

```ts
actions: {
  clearError: ({ assign }) => assign({ error: null }),
},
states: {
  submitting: {
    exit: 'captureTiming',
    on: { CANCEL: { target: 'editing', actions: 'clearError' } },
  },
}
```

Actions run in order: source `exit`, transition actions, state update, then target `entry`. Same-state transitions do not re-enter by default; set `reenter: true` when they should.
