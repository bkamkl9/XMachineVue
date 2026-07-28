/**
 * Typed workflow state machines for Vue applications.
 *
 * @example
 * ```ts
 * import { defineMachine, useMachine } from "@bkamkl9/xmachinevue";
 *
 * const machine = defineMachine<{ count: number }, { type: "increment" }>()({
 *   context: () => ({ count: 0 }),
 *   initial: "ready",
 *   states: {
 *     ready: {
 *       on: { increment: { actions: ({ assign }) => assign({ count: 1 }) } },
 *     },
 *   },
 * });
 *
 * const actor = useMachine(machine);
 * actor.send({ type: "increment" });
 * ```
 *
 * @module
 */

export { createActor, defineMachine } from "./core/machine";
export {
  createMachineKey,
  injectMachine,
  provideMachine,
  useMachine,
  useSelector,
} from "./vue";
export { createPersistencePlugin } from "./plugins/persistence";
export type {
  ActionMeta,
  AnyEvent,
  CreateActorOptions,
  EventObject,
  InvokeMeta,
  MachineAction,
  MachineActor,
  MachineConfig,
  MachineDefinition,
  MachineGuard,
  MachinePlugin,
  MachineService,
  MachineSnapshot,
  StateConfig,
  TransitionConfig,
  TransitionRecord,
} from "./core/types";
export type { PersistenceOptions, StorageLike } from "./plugins/persistence";
