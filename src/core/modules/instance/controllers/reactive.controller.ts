import { reactive, watch, toRaw } from 'vue'
import type { AnyObject } from '../../../types/helper.types'
import { recursiveReassign } from '../../../utils/object'
import type { InstanceService } from '../instance.service'

export class ReactiveController {
  InstanceService: InstanceService
  InitialReactiveState: AnyObject
  ReactiveState: AnyObject

  constructor(InstanceService: InstanceService) {
    this.InstanceService = InstanceService
    this.InitialReactiveState = structuredClone(this.InstanceService.machineSchema?.reactive ?? {})
    this.ReactiveState = reactive(this.InstanceService.machineSchema?.reactive ?? {})
    this.watchForReactiveStateChanges()
  }

  private watchForReactiveStateChanges = () => {
    watch(
      this.ReactiveState,
      (newValue, oldValue) => {
        this.InstanceService.DebugController.logDebugMessage(
          `Reactive state changed from`,
          toRaw(oldValue),
          'to',
          toRaw(newValue),
        )
      },
      { deep: true, flush: 'sync' },
    )
  }

  resetReactive = () => {
    this.InstanceService.DebugController.logDebugMessage('Resetting reactive state')
    recursiveReassign(this.ReactiveState, this.InitialReactiveState)
  }
}
