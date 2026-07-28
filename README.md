# XMachineVue

Typed, component-scoped workflow machines for Vue 3.

Use XMachineVue to pull a component's process—form submission, wizard navigation, modal flow, request lifecycle, upload—from rendering code into an explicit, testable workflow. It is not a replacement for Pinia or a full statechart runtime.

```ts
import { defineMachine, useMachine } from 'xmachinevue'

type Context = { accepted: boolean }
type Event = { type: 'AGREE' } | { type: 'RESET' }

const agreement = defineMachine<Context, Event>()({
  context: () => ({ accepted: false }),
  initial: 'draft',
  states: {
    draft: { on: { AGREE: { target: 'accepted', actions: ({ assign }) => assign({ accepted: true }) } } },
    accepted: { on: { RESET: 'draft' } },
  },
})

const machine = useMachine(agreement)
```

`machine.send(event)` takes only declared transitions. `machine.can(event)` drives controls, `machine.matches(state)` drives the template, and `machine.context` is readonly reactive state. Invoked services are cancelled automatically when their state exits.

## Installation

```bash
pnpm add xmachinevue
```

Vue 3.3+ is required. See the documentation site for modeling workflows, async services, persistence, Vue subtree sharing, and testing.
