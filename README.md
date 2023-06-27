### XMachineVue

XMachineVue is a lightweight npm package that helps implement state machines
with a pinia-like structure. It has basic TypeScript support and it is very
intuitive.

#### Getting started

To install XMachineVue, use the package manager of your choice:

```bash
npm install xmachinevue
```

```bash
yarn install xmachinevue
```

```bash
pnpm install xmachinevue
```

#### Documentation

1. **Creating new machine** To create a new state machine, import the
   `createMachine` function from `xmachinevue`. In the in the function argument
   provide an object with two keys: state, which is a function that returns an
   object, and actions, which you can later use to define states for your
   machine.

   ```typescript
   import { createMachine } from "xmachinevue";

   export const machine = createMachine({
     state: () => {},
     actions: {},
   });
   ```

##### Defining state and actions

1. **States** Let's create a simple state machine that creates a counter which
   will finish its job when the count is equal to 10. In the actions object, you
   can define different states. We will define `INITIAL` and `FINISHED`. In
   these states, you can define any methods that will be available only if
   machine is in current state mode.
2. **The "this" keyword** Using the this keyword in your actions, you can access
   the reactive state object that you defined in the state function, dispatch
   other actions, or change current state of the machine.
   - `this.state.counter`
   - `this.dispatch(action: string, ...args: any[])`
   - `this.changeState(state: string)`
     <br />

```typescript
export const stateMachine = createMachine({
  state: () => ({
    counter: 0,
    finished: false,
  }),
  actions: {
    INITIAL: {
      increment() {
        this.state.counter++;
        if (this.state.counter === 10) this.changeState("FINISHED");
      },
    },
    FINISHED: {
      reset() {
        this.state.counter = 0;
        this.changeState("INITIAL");
      },
    },
  },
});
```

#### 

3. **Hooks** Currently, there are two hooks introduced: `onEnter` and `onLeave`.
   If you want to use them, attach them as methods to the state that you want to
   handle, as in the example below.

   #### 

   ```typescript
   import { createMachine } from "xmachinevue";

   export const stateMachine = createMachine({
     state: () => ({
       loading: false,
       error: null as null | string,
       results: [] as { id: number; username: string }[],
     }),
     actions: {
       INITIAL: {
         fetch() {
           this.changeState("FETCHING");
         },
       },
       FETCHING: {
         async onEnter() {
           this.state.error = null;
           this.state.loading = true;
           try {
             const request = await fetch("https://<someapi>/users");
             const response = await request.json();
             this.state.results = response;
             this.changeState("SUCCESS");
             this.state.loading = false;
           } catch (err) {
             this.state.error = "Failed to fetch: " + err;
             this.state.loading = false;
             this.changeState("ERROR");
           }
         },
       },
       ERROR: {
         onLeave() {
           console.log("trying to fetch again");
         },
         retry() {
           this.changeState("FETCHING");
         },
       },
       SUCCESS: {
         log() {
           console.log("SUCCESS!", this.state.results);
         },
       },
     },
   });
   ```

4. **State machine instance** When calling `createMachine` 4 things are
   returned.
   <br/>
   ```typescript
   const machine = createMachine({ ... })

   /* object with reactive state */
   machine.state

   /* ref containg string with current state */
   machine.current

   /* method used to execute actions defined in states */
   machine.dispatch('actionName')
   // or
   machine.dispatch<'STATE'>('actionName')

   /* method used to change state */
   machine.changeState('stateName')
   ```
