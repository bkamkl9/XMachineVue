# API principles

- `defineMachine<Context, Event>()` creates an immutable definition; it never creates reactive state and preserves the exact state-name union.
- `createActor()` creates an independent runtime instance.
- `useMachine()` is the Vue component-scoped variant of `createActor()`.
- `send(event)` is the only public transition API.
- `state`, `context`, and `snapshot` are readonly.
- `can(event)` checks the current state and guard without executing actions.
- `matches(state)` is a template-friendly state comparison.
- `stop()` aborts active services and releases subscriptions.

XMachineVue intentionally starts with flat workflows. If your domain needs nested states, parallel regions, history, or actor trees, use XState directly rather than expecting this package to become a partial statechart implementation.
