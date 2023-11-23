import { InstanceManager } from '../managers/instance.manager'

export class ReactiveController {
  InstanceManager: InstanceManager

  constructor(InstanceManager: InstanceManager) {
    this.InstanceManager = InstanceManager
  }
}
