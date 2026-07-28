import type { DeepReadonly, Ref } from "vue";

export interface EventObject {
  type: string;
}

export type AnyEvent = EventObject;
export type EventType<TEvent extends AnyEvent> = TEvent["type"];
export type StateValue<TStates> = Extract<keyof TStates, string>;

export interface MachineSnapshot<TContext, TState extends string> {
  value: TState;
  context: DeepReadonly<TContext>;
}

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

export type MachineAction<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
> = (meta: ActionMeta<TContext, TEvent, TState>) => void | Promise<void>;

export type MachineGuard<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
> = (
  context: DeepReadonly<TContext>,
  event: TEvent,
  meta: Pick<ActionMeta<TContext, TEvent, TState>, "from" | "to">,
) => boolean;

export type ActionReference<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
> =
  | string
  | MachineAction<TContext, TEvent, TState>
  | Array<string | MachineAction<TContext, TEvent, TState>>;

export type GuardReference<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
> = string | MachineGuard<TContext, TEvent, TState>;

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

export type Transition<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
> =
  | TState
  | TransitionConfig<TContext, TEvent, TState>
  | Array<TState | TransitionConfig<TContext, TEvent, TState>>;

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

export type MachineService<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
  TResult = unknown,
> = (meta: InvokeMeta<TContext, TEvent, TState>) => Promise<TResult> | TResult;

export interface InvokeConfig<
  TContext,
  TEvent extends AnyEvent,
  TState extends string,
> {
  src: string | MachineService<TContext, TEvent, TState>;
  onDone?: TransitionConfig<TContext, AnyEvent, TState> | TState;
  onError?: TransitionConfig<TContext, AnyEvent, TState> | TState;
}

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

export type StateMap<TContext, TEvent extends AnyEvent> = Record<
  string,
  StateConfig<TContext, TEvent, string>
>;

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

export interface MachinePlugin<
  TContext extends object,
  TEvent extends AnyEvent,
  TState extends string,
> {
  hydrate?: () => Partial<MachineSnapshot<TContext, TState>> | undefined;
  onTransition?: (record: TransitionRecord<TContext, TEvent, TState>) => void;
  onStop?: () => void;
}

export interface CreateActorOptions<
  TContext extends object,
  TEvent extends AnyEvent,
  TState extends string,
> {
  context?: Partial<TContext>;
  plugins?: Array<MachinePlugin<TContext, TEvent, TState>>;
}

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
