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

##### Creating state machine

```typescript
import { createMachine } from "xmachinevue";

const MCH = createMachine({
  state: () => ({
    counter: 0,
  }),
  actions: {
    "MORNING": {
      onEnter() {
        // Runs automatically on entering "MORNING" state
        FUP.from("MORNING").execute("sayHi", "John");
      },
      onLeave() {
        // Runs automatically on leaveing "MORNING" state
        FUP.state.counter += 1;
      },
      sayHi(name: string) {
        console.log("Good morning " + name + "!");
        FUP.changeState("EVENING");
      },
    },
    "EVENING": {
      onEnter() {
        console.log("Bye!!!");
        FUP.from("EVENING").execute("bye");
      },
      bye() {
        if (FUP.state.value === "EVENING") FUP.resetReactive("MORNING");
        /* Resets state object and set current state to "MORNING" */
      },
    },
  },
});
```
