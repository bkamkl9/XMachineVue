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
  }

  initialize = () => {
    if (this.InstanceService.machineSchema.useLocalStorage) {
      console.warn(
        '[XmachineVue] useLocalStorage is deprecated. More info: https://kamilbartczak03.github.io/XMachineVue/pages/local-storage.html',
      )
      this.loadStorageSnapshot()
      this.watchChanges()
    }
  }

  watchChanges = () => {
    const watchOptions = { deep: true, flush: 'sync', immediate: true } as const
    const watchSource = this.InstanceService.ReactiveController.ReactiveState
    watch(watchSource, () => this.saveStorageSnapshot(), watchOptions)
    this.InstanceService.StateController.StateObserver.subscribe(this.saveStorageSnapshot)
  }

  saveStorageSnapshot = () => {
    const reactive = this.InstanceService.ReactiveController.ReactiveState
    const current = this.InstanceService.StateController.StateObserver.target.value
    const stringified = JSON.stringify({ reactive, current }, replacer, 2)

    localStorage.setItem(this.localStorageId, stringified)
  }

  loadStorageSnapshot = () => {
    const localStorageSnapshot = localStorage.getItem(this.localStorageId)
    if (!localStorageSnapshot) return

    const localStorageSave = JSON.parse(localStorageSnapshot, replacer)
    this.InstanceService.StateController.quietChangeState(localStorageSave.current)
    recursiveReassign(this.InstanceService.ReactiveController.ReactiveState, localStorageSave.reactive)
  }
}
