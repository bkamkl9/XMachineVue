import { describe, expect, expectTypeOf, test } from "vitest";
import { effectScope } from "vue";
import {
  type ActionMeta,
  createActor,
  defineMachine,
  useMachine,
} from "../index";
import { createPersistencePlugin } from "../plugins/persistence";

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

type CounterContext = { count: number; ready: boolean };
type CounterEvent = { type: "INCREMENT" } | { type: "FINISH" };

describe("workflow actor", () => {
  test("takes only declared, enabled transitions and runs effects in order", async () => {
    const order: string[] = [];
    const machine = defineMachine<CounterContext, CounterEvent>()({
      context: () => ({ count: 0, ready: false }),
      initial: "editing",
      guards: { ready: (context) => context.ready },
      states: {
        editing: {
          exit: () => {
            order.push("exit:editing");
          },
          on: {
            INCREMENT: {
              actions: ({ assign }) =>
                assign((context) => ({
                  count: context.count + 1,
                  ready: true,
                })),
            },
            FINISH: {
              target: "complete",
              guard: "ready",
              actions: () => {
                order.push("transition");
              },
            },
          },
        },
        complete: {
          entry: () => {
            order.push("entry:complete");
          },
        },
      },
    });
    const actor = createActor(machine);

    expectTypeOf(actor.matches)
      .parameter(0)
      .toEqualTypeOf<"editing" | "complete">();

    expect(actor.can({ type: "FINISH" })).toBe(false);
    expect(actor.send({ type: "FINISH" })).toBe(false);
    expect(actor.send({ type: "INCREMENT" })).toBe(true);
    await settle();

    expect(actor.context.count).toBe(1);
    expect(actor.state.value).toBe("editing");
    order.length = 0;
    expect(actor.send({ type: "FINISH" })).toBe(true);

    // The context is intentionally changed from an action, not a component.
    await settle();
    expect(actor.state.value).toBe("complete");
    expect(order).toEqual(["exit:editing", "transition", "entry:complete"]);
    expect(actor.matches("complete")).toBe(true);
  });

  test("stops a component-scoped actor when its Vue scope is disposed", async () => {
    let aborted = false;
    type Event = { type: "START" };
    const machine = defineMachine<Record<string, never>, Event>()({
      context: () => ({}),
      initial: "idle",
      services: {
        never: ({ signal }) =>
          new Promise<void>((_resolve, reject) => {
            signal.addEventListener("abort", () => {
              aborted = true;
              reject(new Error("aborted"));
            });
          }),
      },
      states: {
        idle: { on: { START: "loading" } },
        loading: { invoke: { src: "never" } },
      },
    });
    const scope = effectScope();
    const actor = scope.run(() => useMachine(machine));
    if (!actor) throw new Error("Expected an active Vue effect scope.");

    actor.send({ type: "START" });
    await settle();
    scope.stop();
    await settle();

    expect(aborted).toBe(true);
  });

  test("creates independent context for every actor and keeps definitions immutable", async () => {
    const source = {
      context: () => ({ count: 0, ready: true }),
      initial: "active" as const,
      states: {
        active: {
          on: {
            INCREMENT: {
              actions: (
                meta: ActionMeta<CounterContext, CounterEvent, string>,
              ) =>
                meta.assign((context) => ({
                  count: context.count + 1,
                })),
            },
          },
        },
      },
    };
    const machine = defineMachine<CounterContext, CounterEvent>()(source);
    const first = createActor(machine);
    const second = createActor(machine);

    first.send({ type: "INCREMENT" });
    await settle();

    expect(first.context.count).toBe(1);
    expect(second.context.count).toBe(0);
    expect(Object.isFrozen(machine.config)).toBe(true);
    expect(machine.config.states).not.toBe(source.states);
  });

  test("rejects an invalid initial state at definition time", () => {
    expect(() =>
      defineMachine<Record<string, never>, { type: "ANY" }>()({
        context: () => ({}),
        initial: "missing" as "idle",
        states: { idle: {} },
      }),
    ).toThrow("unknown initial state");
  });

  test("aborts invoked work when the workflow exits its state", async () => {
    let aborted = false;
    type Event = { type: "START" } | { type: "CANCEL" };
    const machine = defineMachine<{ result: string | null }, Event>()({
      context: () => ({ result: null }),
      initial: "idle",
      services: {
        request: ({ signal }) =>
          new Promise<string>((_resolve, reject) => {
            signal.addEventListener("abort", () => {
              aborted = true;
              reject(new Error("aborted"));
            });
          }),
      },
      states: {
        idle: { on: { START: "loading" } },
        loading: {
          invoke: { src: "request", onDone: "done", onError: "failed" },
          on: { CANCEL: "idle" },
        },
        done: {},
        failed: {},
      },
    });
    const actor = createActor(machine);

    actor.send({ type: "START" });
    await settle();
    actor.send({ type: "CANCEL" });
    await settle();

    expect(aborted).toBe(true);
    expect(actor.state.value).toBe("idle");
  });

  test("hydrates and saves through the optional persistence plugin", async () => {
    const data = new Map<string, string>();
    const storage = {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => data.set(key, value),
    };
    type Event = { type: "NEXT" };
    const machine = defineMachine<{ step: number }, Event>()({
      context: () => ({ step: 1 }),
      initial: "one",
      states: {
        one: {
          on: {
            NEXT: {
              target: "two",
              actions: ({ assign }) => assign({ step: 2 }),
            },
          },
        },
        two: {},
      },
    });
    const plugin = createPersistencePlugin<
      { step: number },
      Event,
      "one" | "two"
    >({
      key: "wizard",
      version: 1,
      storage,
    });
    const first = createActor(machine, { plugins: [plugin] });

    first.send({ type: "NEXT" });
    await settle();
    const second = createActor(machine, { plugins: [plugin] });

    expect(second.state.value).toBe("two");
    expect(second.context.step).toBe(2);
  });
});
