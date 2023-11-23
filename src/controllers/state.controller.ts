import { InstanceManager } from '../managers/instance.manager'

export class StateController {
  InstanceManager: InstanceManager

  constructor(InstanceManager: InstanceManager) {
    this.InstanceManager = InstanceManager
  }
}
