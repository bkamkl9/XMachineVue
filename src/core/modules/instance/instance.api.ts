import type { ShallowRef } from "vue";
import type { RemoveThis } from "../../types/helper.types";
import { InstanceManager } from "./instance.manager";

const instanceManager = new InstanceManager();

export function createMachine<R, S>(
  id: string,
  schema: XMACHINEVUE.MachineTemplate<R, S>,
) {
  type KeyofStates = keyof (typeof schema)["states"];
  const instanceService = instanceManager.createMachine(id, schema);

  return {
    resetReactive: instanceService.ReactiveController.resetReactive,
    changeState: instanceService.StateController.changeCurrentState as (
      state: keyof S,
    ) => void,
    currentState: instanceService.StateController.StateObserver
      .target as ShallowRef<KeyofStates>,
    ...(schema.states as RemoveThis<S>),
    reactive: instanceService.ReactiveController.ReactiveState as R,
  };
}
