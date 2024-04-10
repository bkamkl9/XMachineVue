import { reactive } from "vue";
import type { AnyObject } from "../../../types/helper.types";
import { recursiveReassign } from "../../../utils/object";
import type { InstanceService } from "../instance.service";

export class ReactiveController {
  InstanceService: InstanceService;
  InitialReactiveState: AnyObject;
  ReactiveState: AnyObject;

  constructor(InstanceService: InstanceService) {
    this.InstanceService = InstanceService;
    this.InitialReactiveState = structuredClone(
      this.InstanceService.machineSchema?.reactive ?? {},
    );
    this.ReactiveState = reactive(
      this.InstanceService.machineSchema?.reactive ?? {},
    );
  }

  resetReactive = () => {
    recursiveReassign(this.ReactiveState, this.InitialReactiveState);
  };
}
