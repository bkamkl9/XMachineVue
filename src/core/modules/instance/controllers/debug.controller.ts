import type { InstanceService } from '../instance.service'

export class DebugController {
  private isDebugModeEnabled: boolean = false

  constructor(private InstanceService: InstanceService) {
    this.isDebugModeEnabled = this.InstanceService.machineSchema.debug ?? false
  }

  logDebugMessage = (...messages: any[]) => {
    if (this.isDebugModeEnabled === false) return

    const instanceId = this.InstanceService.machineId
    const currentTime = new Date().toLocaleTimeString() + ':' + new Date().getMilliseconds().toString().padStart(3, '0')
    console.debug(`%c[XMachineVue: ${currentTime} "${instanceId}"]`, 'color: lightgreen', ...messages)
  }
}
