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
