import { InstanceService } from './instance.service'

interface InstanceEntry {
  id: string
  service: InstanceService
}

export class InstanceManager {
  InstanceRegistry: InstanceEntry[] = []

  createMachine(id: string, schema: any) {
    const InstanceRegistryIndex = this.InstanceRegistry.findIndex((service) => service.id === id)
    if (InstanceRegistryIndex === -1) {
      const service = new InstanceService(schema, id)
      this.InstanceRegistry.push({ service, id })
      return service
    }
    console.warn(`[XmachineVue] Machine with "${id}" already exist. Returned existing machine instance.`)
    return this.InstanceRegistry[InstanceRegistryIndex].service
  }
}
