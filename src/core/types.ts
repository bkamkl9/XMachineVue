/** Shared type contracts for XMachineVue machine definitions, actors, and plugins. @module */

import type { DeepReadonly, Ref } from "vue";

/** The minimum shape of an event accepted by a machine. */
export interface EventObject {
  type: string;
}

/** A non-specific event shape for generic machine APIs. */
export type AnyEvent = EventObject;
/** Extracts the string union of event type names from an event union. */
export type EventType<TEvent extends AnyEvent> = TEvent["type"];
/** Extracts the string union of state names from a state map. */
export type StateValue<TStates> = Extract<keyof TStates, string>;

/** An immutable view of an actor at a particular point in time. */
export interface MachineSnapshot<TContext, TState extends string> {
  value: TState;
  context: DeepReadonly<TContext>;
}

/** Values made available to an action while a transition is being processed. */
export interface ActionMeta<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
> {
  from: TState;
  to: TState;
  event: TEvent;
  signal: AbortSignal;
  context: DeepReadonly<TContext>;
  assign: (
    patch:
      | Partial<TContext>
      | ((context: DeepReadonly<TContext>, event: TEvent) => Partial<TContext>),
  ) => void;
  send: (event: TEvent) => boolean;
}

/** An effect run during a transition, state entry, or state exit. */
export type MachineAction<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
> = (meta: ActionMeta<TContext, TEvent, TState>) => void | Promise<void>;

/** Decides whether a candidate transition may be taken. */
export type MachineGuard<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
> = (
  context: DeepReadonly<TContext>,
  event: TEvent,
  meta: Pick<ActionMeta<TContext, TEvent, TState>, "from" | "to">,
) => boolean;

/** An inline action, a named action, or an ordered group of actions. */
export type ActionReference<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
> =
  | string
  | MachineAction<TContext, TEvent, TState>
  | Array<string | MachineAction<TContext, TEvent, TState>>;

/** An inline guard or the name of a guard declared on the machine. */
export type GuardReference<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
> = string | MachineGuard<TContext, TEvent, TState>;

/** Configures a possible transition from a state in response to an event. */
export interface TransitionConfig<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
> {
  target?: TState;
  guard?: GuardReference<TContext, TEvent, TState>;
  actions?: ActionReference<TContext, TEvent, TState>;
  /** Run the state's exit and entry effects when target equals source. */
  reenter?: boolean;
  description?: string;
}

/** A shorthand state target or a fully configured transition. */
export type Transition<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
> =
  | TState
  | TransitionConfig<TContext, TEvent, TState>
  | Array<TState | TransitionConfig<TContext, TEvent, TState>>;

/** Values supplied to a service invoked by an active state. */
export interface InvokeMeta<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
> {
  context: DeepReadonly<TContext>;
  event: TEvent;
  signal: AbortSignal;
  state: TState;
}

/** An asynchronous or synchronous operation invoked while a state is active. */
export type MachineService<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
  TResult = unknown,
> = (meta: InvokeMeta<TContext, TEvent, TState>) => Promise<TResult> | TResult;

/** Configures a service and the transitions taken when it settles. */
export interface InvokeConfig<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
> {
  src: string | MachineService<TContext, TEvent, TState>;
  onDone?: TransitionConfig<TContext, AnyEvent, TState> | TState;
  onError?: TransitionConfig<TContext, AnyEvent, TState> | TState;
}

/** Defines the transitions and lifecycle effects for one machine state. */
export interface StateConfig<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
> {
  on?: Partial<Record<EventType<TEvent>, Transition<TContext, TEvent, TState>>>;
  entry?: ActionReference<TContext, TEvent, TState>;
  exit?: ActionReference<TContext, TEvent, TState>;
  invoke?:
    | InvokeConfig<TContext, TEvent, TState>
    | Array<InvokeConfig<TContext, TEvent, TState>>;
  description?: string;
}

/** Maps state names to their state configuration. */
export type StateMap<TContext, TEvent extends AnyEvent> = Record<
  string,
  StateConfig<TContext, TEvent, string>
>;

/** The declarative, typed source of truth for a workflow machine. */
export interface MachineConfig<
  TContext extends object,
  TEvent extends AnyEvent,
  TStates extends StateMap<TContext, TEvent>,
> {
  id?: string;
  context: () => TContext;
  initial: StateValue<TStates>;
  states: TStates;
  actions?: Record<
    string,
    MachineAction<TContext, TEvent, StateValue<TStates>>
  >;
  guards?: Record<string, MachineGuard<TContext, TEvent, StateValue<TStates>>>;
  services?: Record<
    string,
    MachineService<TContext, TEvent, StateValue<TStates>>
  >;
}

/** An immutable validated machine definition returned by `defineMachine`. */
export interface MachineDefinition<
  TContext extends object,
  TEvent extends AnyEvent,
  TState extends string,
> {
  readonly config: MachineConfig<TContext, TEvent, StateMap<TContext, TEvent>>;
  readonly id: string | undefined;
  readonly initial: TState;
  readonly states: Readonly<
    Record<TState, StateConfig<TContext, TEvent, TState>>
  >;
}

/** Describes one processed event and the snapshot it produced. */
export interface TransitionRecord<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
> {
  from: TState;
  to: TState;
  event: TEvent;
  changed: boolean;
  snapshot: MachineSnapshot<TContext, TState>;
}

/** Extends an actor with lifecycle hooks such as persistence and hydration. */
export interface MachinePlugin<
  TContext extends object,
  TEvent extends AnyEvent,
  TState extends string,
> {
  hydrate?: () => Partial<MachineSnapshot<TContext, TState>> | undefined;
  onTransition?: (record: TransitionRecord<TContext, TEvent, TState>) => void;
  onStop?: () => void;
}

/** Optional initial context overrides and plugins used when creating an actor. */
export interface CreateActorOptions<
  TContext extends object,
  TEvent extends AnyEvent,
  TState extends string,
> {
  context?: Partial<TContext>;
  plugins?: Array<MachinePlugin<TContext, TEvent, TState>>;
}

/** A running state-machine instance with reactive Vue state. */
export interface MachineActor<
  TContext extends object,
  TEvent extends AnyEvent,
  TState extends string,
> {
  readonly state: Readonly<Ref<TState>>;
  readonly context: DeepReadonly<TContext>;
  readonly snapshot: Readonly<Ref<MachineSnapshot<TContext, TState>>>;
  send: (event: TEvent) => boolean;
  can: (event: TEvent) => boolean;
  matches: (state: TState) => boolean;
  subscribe: (
    listener: (record: TransitionRecord<TContext, TEvent, TState>) => void,
  ) => () => void;
  stop: () => void;
}
