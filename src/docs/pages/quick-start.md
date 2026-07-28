# Quick start

Use a machine for a component process with mutually exclusive modes: a form, wizard, modal, upload, checkout, or async request. Keep rendering in the component and move workflow rules into a definition.

```ts
import { defineMachine, useMachine } from 'xmachinevue'

type Context = { accepted: boolean }
type Event = { type: 'AGREE' } | { type: 'RESET' }

const agreement = defineMachine<Context, Event>()({
  id: 'agreement',
  context: () => ({ accepted: false }),
  initial: 'draft',
  states: {
    draft: {
      on: {
        AGREE: { target: 'accepted', actions: ({ assign }) => assign({ accepted: true }) },
      },
    },
    accepted: { on: { RESET: 'draft' } },
  },
})

const machine = useMachine(agreement)
machine.send({ type: 'AGREE' })
```

`state` is a readonly Vue ref, `context` is readonly reactive data, and `send()` is the only way to move through the workflow.

```vue
<button :disabled="!machine.can({ type: 'AGREE' })" @click="machine.send({ type: 'AGREE' })">
  Agree
</button>

<p v-if="machine.matches('accepted')">Accepted</p>
```
