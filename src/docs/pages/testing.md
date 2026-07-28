# Testing workflows

Definitions are framework-independent. Create an actor, send events, and assert the observable snapshot.

```ts
test('agreement can only be accepted from draft', async () => {
  const actor = createActor(agreement)

  expect(actor.can({ type: 'AGREE' })).toBe(true)
  actor.send({ type: 'AGREE' })
  await Promise.resolve()

  expect(actor.state.value).toBe('accepted')
  expect(actor.context.accepted).toBe(true)
  expect(actor.can({ type: 'AGREE' })).toBe(false)
})
```

Use `subscribe()` when a test needs to assert transition order, analytics integrations, or persistence behavior. Services receive `AbortSignal`, making cancellation testable without mounting a component.
