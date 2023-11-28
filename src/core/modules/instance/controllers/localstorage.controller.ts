import { InstanceService } from '../instance.service'
import { watch } from 'vue'
import { replacer } from '../../../utils/object'
import { recursiveReassign } from '../../../utils/object'

export class LocalStorageController {
  InstanceService: InstanceService
  localStorageId: string

  constructor(InstanceService: InstanceService) {
    this.InstanceService = InstanceService
    this.localStorageId = `__XMACHINE__.ID(${InstanceService.machineId})`
    if (InstanceService.machineSchema.useLocalStorage) {
      this.loadStorageSnapshot()
      this.watchChanges()
    }
  }

  private watchChanges() {
    const watchOptions = { deep: true, flush: 'sync', immediate: true } as const
    const watchSource = this.InstanceService.ReactiveController.ReactiveState
    watch(watchSource, () => this.saveStorageSnapshot(), watchOptions)
    this.InstanceService.StateController.StateObserver.subscribe(this.saveStorageSnapshot)
  }

  private saveStorageSnapshot() {
    const reactive = this.InstanceService.ReactiveController.ReactiveState
    const current = this.InstanceService.StateController.StateObserver.value.value
    const stringified = JSON.stringify({ reactive, current }, replacer, 2)

    localStorage.setItem(this.localStorageId, stringified)
  }

  private loadStorageSnapshot() {
    const localStorageSnapshot = localStorage.getItem(this.localStorageId)
    if (localStorageSnapshot) {
      const localStorageSave = JSON.parse(localStorageSnapshot, replacer)
      this.InstanceService.StateController.changeCurrentState(localStorageSave.current)
      recursiveReassign(this.InstanceService.ReactiveController.ReactiveState, localStorageSave.reactive)
    }
  }
}
