/** Vue composition and dependency-injection helpers for machine actors. @module */

import {
  type ComputedRef,
  type InjectionKey,
  computed,
  getCurrentScope,
  inject,
  onScopeDispose,
  provide,
} from "vue";
import { createActor } from "./core/machine";
import type {
  AnyEvent,
  CreateActorOptions,
  MachineActor,
  MachineDefinition,
} from "./core/types";

/**
 * Creates a machine actor and automatically stops it when the current Vue
 * component scope is disposed. Call `createActor` for app-scoped actors.
 */
export function useMachine<
  TContext extends object,
  TEvent extends AnyEvent,
  TState extends string,
>(
  machine: MachineDefinition<TContext, TEvent, TState>,
  options?: CreateActorOptions<TContext, TEvent, TState>,
): MachineActor<TContext, TEvent, TState> {
  const actor = createActor(machine, options);
  if (getCurrentScope()) onScopeDispose(actor.stop);
  return actor;
}

/** Creates a typed injection key for sharing one workflow with a component subtree. */
export function createMachineKey<
  TContext extends object,
  TEvent extends AnyEvent,
  TState extends string,
>(description?: string): InjectionKey<MachineActor<TContext, TEvent, TState>> {
  return Symbol(description) as InjectionKey<
    MachineActor<TContext, TEvent, TState>
  >;
}

/** Provides an actor to descendants using a typed Vue injection key. */
export function provideMachine<
  TContext extends object,
  TEvent extends AnyEvent,
  TState extends string,
>(
  key: InjectionKey<MachineActor<TContext, TEvent, TState>>,
  actor: MachineActor<TContext, TEvent, TState>,
): void {
  provide(key, actor);
}

/** Retrieves a provided actor or throws when no matching actor exists. */
export function injectMachine<
  TContext extends object,
  TEvent extends AnyEvent,
  TState extends string,
>(
  key: InjectionKey<MachineActor<TContext, TEvent, TState>>,
): MachineActor<TContext, TEvent, TState> {
  const actor = inject(key);
  if (!actor)
    throw new Error("No machine actor was provided for this injection key.");
  return actor;
}

/** Derive reactive values from an actor without adding another store layer. */
export function useSelector<
  TContext extends object,
  TEvent extends AnyEvent,
  TState extends string,
  TResult,
>(
  actor: MachineActor<TContext, TEvent, TState>,
  selector: (snapshot: {
    state: TState;
    context: import("vue").DeepReadonly<TContext>;
  }) => TResult,
): ComputedRef<TResult> {
  return computed(() =>
    selector({ state: actor.state.value, context: actor.context }),
  );
}
