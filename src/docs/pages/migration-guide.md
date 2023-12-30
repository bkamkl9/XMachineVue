# Migration guide
## Migrating from 2.0.0 to 3.0.0

1. **Reactive object definition**

- Way of defining reactive state has changed from `state: () => ({ ... })` to `reactive: { ... }`

2. **Executing actions**

- Executing actions from machine instance no longer uses `.from()` method. Instead actions are directly called from the state key like this: `machine.INITIAL.increment(1)`

3. **Action context has been changed**

- `this.$state` to `this.$reactive`
- `this.changeState` to `this.$changeState`
- `this.resetState` to `this.$resetReactive`

4. **Machine instance method has been changed**

- `this.$state` to `this.reactive`
- `this.$changeState` to `this.changeState`
- `this.$resetState` to `this.resetReactive`

5. **onEnter and onLeave hooks has been renamed**

- `onEnter` hook has been renamed to `$onEnter`
- `onLeave` hook has been renamed to `$onLeave`

6. **Initial state key is required while defining machine**

- adding `initial: string` key to machine is now required.