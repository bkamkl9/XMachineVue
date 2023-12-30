# LocalStorage (deprecated)
**This feature in the future will be replaced by third party plugin**

## Preserving the state with the LocalStorage API
The `useLocalStorage` option in `xMachineVue` allows you to persist the state of your machine in the browser's local storage. This can be particularly useful if you want to maintain state across browser sessions or refreshes.

When you initialize your machine, you can set `useLocalStorage: true` to enable this feature. Here's an example:

```typescript
const machine = createMachine('some-machine', {
  useLocalStorage: true,
  /* (...) */
});
```

When `useLocalStorage` is set to `true`, the state of the machine and any reactive objects are stored in local storage. The key used for storing this data is `__XMACHINE__.ID(<machine id>)`, where `<machine id>` is the ID of your machine (in this case, 'some-machine').

This means that even if the user closes the browser or refreshes the page, the state of the machine will be preserved and can be reloaded the next time the page is opened. This can be very useful for maintaining user progress or settings across sessions.