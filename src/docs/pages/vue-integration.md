# Vue integration

`useMachine()` creates one actor for the current component scope and stops it automatically on unmount.

```vue
<script setup lang="ts">
import { useMachine, useSelector, createMachineKey, provideMachine, injectMachine } from 'xmachinevue'
import { checkoutMachine } from './checkout.machine'

const checkout = useMachine(checkoutMachine)
const hasError = useSelector(checkout, ({ context }) => Boolean(context.error))
</script>

<template>
  <button @click="checkout.send({ type: 'SUBMIT' })" :disabled="!checkout.can({ type: 'SUBMIT' })">Submit</button>
  <Spinner v-if="checkout.matches('saving')" />
  <ErrorBox v-if="hasError" :message="checkout.context.error" />
</template>
```

For a workflow shared by a component subtree, define a typed key and provide the actor once:

```ts
export const checkoutKey = createMachineKey<CheckoutContext, CheckoutEvent, CheckoutState>('checkout')

provideMachine(checkoutKey, checkout)
// Descendants: const checkout = injectMachine(checkoutKey)
```

Use `createActor()` instead of `useMachine()` for an app-scoped actor. You then own its lifetime and must call `stop()`.
