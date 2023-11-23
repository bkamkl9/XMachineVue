import { InstanceManager } from '../managers/instance.manager'

export class ActionController {
  InstanceManager: InstanceManager

  constructor(InstanceManager: InstanceManager) {
    this.InstanceManager = InstanceManager
  }
}
