# Async work and cancellation

Put a request in an invoked state. The service gets a readonly context, the event that entered the state, and an `AbortSignal`. It is aborted when the actor stops or the machine leaves the invoking state.

```ts
const saveFlow = defineMachine<FormContext, Event>()({
  context: () => ({ values: emptyForm(), error: null }),
  initial: 'editing',
  services: {
    save: async ({ context, signal }) => {
      const response = await fetch('/api/orders', {
        method: 'POST', body: JSON.stringify(context.values), signal,
      })
      if (!response.ok) throw new Error('Save failed')
      return response.json()
    },
  },
  actions: {
    captureError: ({ assign, event }) => assign({ error: String((event as { error: Error }).error.message) }),
  },
  states: {
    editing: { on: { SUBMIT: 'saving' } },
    saving: {
      invoke: { src: 'save', onDone: 'complete', onError: { target: 'failure', actions: 'captureError' } },
      on: { CANCEL: 'editing' },
    },
    failure: { on: { RETRY: 'saving', EDIT: 'editing' } },
    complete: {},
  },
})
```

This eliminates stale responses: a completed request is ignored after its state has been exited or its signal is aborted.
