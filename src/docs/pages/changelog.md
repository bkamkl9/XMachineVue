# Changelog

### 3.2.0

- **Feature:** Added `debug` flag to machine schema
- **Chore:** Updated dependencies

### 3.1.1

-- **Bug:** Hooks don't execute when initializing machine

### 3.1.0

-- **Docs:** Created new documentation site
-- **Deprecated** useLocalStorage has been deprecated
-- **Code:** Rewritten core to objective modules architecture

### 3.0.2

-- **Docs:** Improved README.md and documentation

### 3.0.1

- **Bug:** Exclude tests declarations files from generating

### 3.0.0

- **Feature:** Added `useLocalStorage` flag for preserving state and reactive object in LocalStorage
- **Feature:** Added unit test to te repository

#### Breaking changes:

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

### 2.0.3

- **Bug:** Fixed bug in the documentation: changed `defineMachine` to `createMachine`
- **Feature:** Added { initial: "{{state}}" } key to state machine
