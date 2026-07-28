# Persistence

Persistence is opt-in. The browser adapter does nothing during SSR, stores a versioned snapshot after transitions, and can migrate old snapshots.

```ts
const machine = useMachine(checkoutMachine, {
  plugins: [
    createPersistencePlugin<CheckoutContext, CheckoutEvent, CheckoutState>({
      key: 'checkout-draft',
      version: 2,
      migrate: (persisted) => {
        // Validate and transform unknown data before returning a partial snapshot.
        return undefined
      },
    }),
  ],
})
```

Persist only data that is safe to restore. Never persist credentials, and validate untrusted stored data in `migrate` before using it.
