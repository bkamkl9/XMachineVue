/** Creates immutable workflow definitions and reactive actors. @module */

import { computed, reactive, readonly, shallowRef } from "vue";
import type {
  ActionMeta,
  ActionReference,
  AnyEvent,
  CreateActorOptions,
  MachineAction,
  MachineActor,
  MachineConfig,
  MachineDefinition,
  MachineGuard,
  MachinePlugin,
  MachineService,
  MachineSnapshot,
  StateConfig,
  StateMap,
  StateValue,
  Transition,
  TransitionConfig,
  TransitionRecord,
} from "./types";

const INTERNAL_INIT = { type: "@xmachine/init" };
const INTERNAL_DONE = "@xmachine/done";
const INTERNAL_ERROR = "@xmachine/error";

function transitionList<
  TContext extends object,
  TEvent extends AnyEvent,
  TState extends string,
>(transition: Transition<TContext, TEvent, TState>) {
  return Array.isArray(transition) ? transition : [transition];
}

function normalizeTransition<
  TContext extends object,
  TEvent extends AnyEvent,
  TState extends string,
>(
  transition: TState | TransitionConfig<TContext, TEvent, TState>,
): TransitionConfig<TContext, TEvent, TState> {
  return typeof transition === "string" ? { target: transition } : transition;
}

function asActions<
  TContext extends object,
  TEvent extends AnyEvent,
  TState extends string,
>(actions: ActionReference<TContext, TEvent, TState> | undefined) {
  if (!actions) return [];
  return Array.isArray(actions) ? actions : [actions];
}

function cloneAndFreeze<T>(value: T): T {
  if (Array.isArray(value))
    return Object.freeze(value.map(cloneAndFreeze)) as T;
  if (value && typeof value === "object") {
    const copy = Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        cloneAndFreeze(item),
      ]),
    );
    return Object.freeze(copy) as T;
  }
  return value;
}

function createDefinition<
  TContext extends object,
  TEvent extends AnyEvent,
  TStates extends StateMap<TContext, TEvent> = StateMap<TContext, TEvent>,
>(
  config: MachineConfig<TContext, TEvent, TStates>,
): MachineDefinition<TContext, TEvent, StateValue<TStates>> {
  if (!(config.initial in config.states)) {
    throw new Error(
      `Machine \"${config.id ?? "anonymous"}\" has an unknown initial state \"${config.initial}\".`,
    );
  }

  const definitionConfig = cloneAndFreeze(config) as unknown as MachineConfig<
    TContext,
    TEvent,
    StateMap<TContext, TEvent>
  >;
  return Object.freeze({
    config: definitionConfig,
    id: definitionConfig.id,
    initial: definitionConfig.initial as StateValue<TStates>,
    states: definitionConfig.states as Readonly<
      Record<
        StateValue<TStates>,
        StateConfig<TContext, TEvent, StateValue<TStates>>
      >
    >,
  });
}

/**
 * Creates an immutable, typed workflow definition. Use the builder form
 * (`defineMachine<Context, Event>()`) when you want
 * TypeScript to infer the exact union of declared state names.
 */
export function defineMachine<
  TContext extends object,
  TEvent extends AnyEvent,
>(): <const TStates extends StateMap<TContext, TEvent>>(
  config: MachineConfig<TContext, TEvent, TStates>,
) => MachineDefinition<TContext, TEvent, StateValue<TStates>>;
export function defineMachine<
  TContext extends object,
  TEvent extends AnyEvent,
  TStates extends StateMap<TContext, TEvent> = StateMap<TContext, TEvent>,
>(
  config: MachineConfig<TContext, TEvent, TStates>,
): MachineDefinition<TContext, TEvent, StateValue<TStates>>;
export function defineMachine(config?: unknown): unknown {
  if (config === undefined) {
    return (nextConfig: unknown) => createDefinition(nextConfig as never);
  }
  return createDefinition(config as never);
}

/** Creates a reactive, independently controllable runtime actor for a machine. */
export function createActor<
  TContext extends object,
  TEvent extends AnyEvent,
  TState extends string,
>(
  machine: MachineDefinition<TContext, TEvent, TState>,
  options: CreateActorOptions<TContext, TEvent, TState> = {},
): MachineActor<TContext, TEvent, TState> {
  const hydrated = options.plugins
    ?.map((plugin) => plugin.hydrate?.())
    .find(Boolean);
  const initialState: TState =
    hydrated?.value && machine.states[hydrated.value]
      ? hydrated.value
      : machine.initial;
  const context = reactive({
    ...machine.config.context(),
    ...hydrated?.context,
    ...options.context,
  }) as TContext;
  const state = shallowRef<TState>(initialState);
  const listeners = new Set<
    (record: TransitionRecord<TContext, TEvent, TState>) => void
  >();
  const plugins: Array<MachinePlugin<TContext, TEvent, TState>> =
    options.plugins ?? [];
  const activeInvocations = new Set<AbortController>();
  const queue: TEvent[] = [];
  let processing = false;
  let stopped = false;

  const contextView = () =>
    readonly(context) as unknown as import("vue").DeepReadonly<TContext>;

  const snapshot = computed<MachineSnapshot<TContext, TState>>(() => ({
    value: state.value,
    context: contextView(),
  }));

  const resolveGuard = (
    guard: TransitionConfig<TContext, TEvent, TState>["guard"],
    event: TEvent,
    from: TState,
    to: TState,
  ) => {
    if (!guard) return true;
    const implementation =
      typeof guard === "string" ? machine.config.guards?.[guard] : guard;
    if (!implementation)
      throw new Error(
        `Unknown guard \"${String(guard)}\" in machine \"${machine.id ?? "anonymous"}\".`,
      );
    return (implementation as MachineGuard<TContext, TEvent, TState>)(
      contextView(),
      event,
      { from, to },
    );
  };

  const pickTransition = (event: TEvent) => {
    const from = state.value;
    const source = machine.states[from as TState] as StateConfig<
      TContext,
      TEvent,
      TState
    >;
    const configured = source.on?.[event.type as TEvent["type"]];
    if (!configured) return undefined;
    for (const candidate of transitionList(
      configured as Transition<TContext, TEvent, TState>,
    )) {
      const transition = normalizeTransition(candidate);
      const to = transition.target ?? from;
      if (!(to in machine.states))
        throw new Error(
          `Unknown target state \"${to}\" in machine \"${machine.id ?? "anonymous"}\".`,
        );
      if (resolveGuard(transition.guard, event, from, to)) return transition;
    }
    return undefined;
  };

  const assign = (
    patch:
      | Partial<TContext>
      | ((
          current: import("vue").DeepReadonly<TContext>,
          event: TEvent,
        ) => Partial<TContext>),
    event: TEvent,
  ) => {
    const value =
      typeof patch === "function" ? patch(contextView(), event) : patch;
    Object.assign(context, value);
  };

  const runActions = async (
    actions: ActionReference<TContext, TEvent, TState> | undefined,
    event: TEvent,
    from: TState,
    to: TState,
    signal: AbortSignal,
  ) => {
    for (const reference of asActions(actions)) {
      const action =
        typeof reference === "string"
          ? machine.config.actions?.[reference]
          : reference;
      if (!action)
        throw new Error(
          `Unknown action \"${String(reference)}\" in machine \"${machine.id ?? "anonymous"}\".`,
        );
      const meta: ActionMeta<TContext, TEvent, TState> = {
        from,
        to,
        event,
        signal,
        context: contextView(),
        assign: (patch) => assign(patch, event),
        send,
      };
      await (action as MachineAction<TContext, TEvent, TState>)(meta);
    }
  };

  const cancelInvocations = () => {
    for (const controller of activeInvocations) controller.abort();
    activeInvocations.clear();
  };

  const invoke = (
    config: StateConfig<TContext, TEvent, TState>,
    event: TEvent,
    activeState: TState,
  ) => {
    const invocations = config.invoke
      ? Array.isArray(config.invoke)
        ? config.invoke
        : [config.invoke]
      : [];
    for (const invocation of invocations) {
      const controller = new AbortController();
      activeInvocations.add(controller);
      const service =
        typeof invocation.src === "string"
          ? machine.config.services?.[invocation.src]
          : invocation.src;
      if (!service)
        throw new Error(
          `Unknown service \"${String(invocation.src)}\" in machine \"${machine.id ?? "anonymous"}\".`,
        );
      Promise.resolve(
        (service as MachineService<TContext, TEvent, TState>)({
          context: contextView(),
          event,
          signal: controller.signal,
          state: activeState,
        }),
      )
        .then(async (output) => {
          if (
            controller.signal.aborted ||
            stopped ||
            state.value !== activeState
          )
            return;
          await takeConfiguredTransition(invocation.onDone, {
            type: INTERNAL_DONE,
            output,
          } as unknown as TEvent);
        })
        .catch(async (error: unknown) => {
          if (
            controller.signal.aborted ||
            stopped ||
            state.value !== activeState
          )
            return;
          await takeConfiguredTransition(invocation.onError, {
            type: INTERNAL_ERROR,
            error,
          } as unknown as TEvent);
        })
        .finally(() => activeInvocations.delete(controller));
    }
  };

  const performTransition = async (
    transition: TransitionConfig<TContext, TEvent, TState>,
    event: TEvent,
  ) => {
    const from = state.value;
    const to = transition.target ?? from;
    const changed = from !== to;
    const reenter = transition.reenter === true;
    const controller = new AbortController();
    if (changed || reenter) {
      cancelInvocations();
      await runActions(
        (
          machine.states[from as TState] as StateConfig<
            TContext,
            TEvent,
            TState
          >
        ).exit,
        event,
        from,
        to,
        controller.signal,
      );
    }
    await runActions(transition.actions, event, from, to, controller.signal);
    if (changed || reenter) state.value = to;
    if (changed || reenter) {
      await runActions(
        (machine.states[to as TState] as StateConfig<TContext, TEvent, TState>)
          .entry,
        event,
        from,
        to,
        controller.signal,
      );
      invoke(
        machine.states[to as TState] as StateConfig<TContext, TEvent, TState>,
        event,
        to,
      );
    }
    const record: TransitionRecord<TContext, TEvent, TState> = {
      from,
      to,
      event,
      changed,
      snapshot: snapshot.value,
    };
    for (const listener of listeners) listener(record);
    for (const plugin of plugins) plugin.onTransition?.(record);
  };

  const takeConfiguredTransition = async (
    configured:
      | TransitionConfig<TContext, AnyEvent, TState>
      | TState
      | undefined,
    event: TEvent,
  ) => {
    if (!configured || stopped) return false;
    const transition = normalizeTransition(
      configured as unknown as
        | TState
        | TransitionConfig<TContext, TEvent, TState>,
    );
    const to = transition.target ?? state.value;
    if (!(to in machine.states))
      throw new Error(
        `Unknown target state \"${to}\" in machine \"${machine.id ?? "anonymous"}\".`,
      );
    if (!resolveGuard(transition.guard, event, state.value, to)) return false;
    await performTransition(transition, event);
    return true;
  };

  const process = async () => {
    if (processing) return;
    processing = true;
    try {
      while (queue.length && !stopped) {
        const event = queue.shift();
        if (!event) continue;
        const transition = pickTransition(event);
        if (transition) await performTransition(transition, event);
      }
    } finally {
      processing = false;
    }
  };

  const send = (event: TEvent) => {
    if (stopped || !can(event)) return false;
    queue.push(event);
    void process();
    return true;
  };

  const can = (event: TEvent) =>
    !stopped && pickTransition(event) !== undefined;

  const actor: MachineActor<TContext, TEvent, TState> = {
    state: readonly(state) as unknown as Readonly<import("vue").Ref<TState>>,
    context: contextView(),
    snapshot: readonly(snapshot) as unknown as Readonly<
      import("vue").Ref<MachineSnapshot<TContext, TState>>
    >,
    send,
    can,
    matches: (value) => state.value === value,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    stop: () => {
      if (stopped) return;
      stopped = true;
      queue.length = 0;
      cancelInvocations();
      listeners.clear();
      for (const plugin of plugins) plugin.onStop?.();
    },
  };

  const initialEvent = INTERNAL_INIT as unknown as TEvent;
  void runActions(
    (
      machine.states[state.value as TState] as StateConfig<
        TContext,
        TEvent,
        TState
      >
    ).entry,
    initialEvent,
    state.value as TState,
    state.value as TState,
    new AbortController().signal,
  ).then(() => {
    if (!stopped)
      invoke(
        machine.states[state.value as TState] as StateConfig<
          TContext,
          TEvent,
          TState
        >,
        initialEvent,
        state.value as TState,
      );
  });
  return actor;
}
