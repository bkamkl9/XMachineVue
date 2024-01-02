import { ShallowRef, readonly, shallowRef } from 'vue'

type SubscribeFunction<T> = (updated: T | null, previous: T | null) => any

export class Observer<T> {
  subscribers: SubscribeFunction<T>[]
  target: ShallowRef<T>

  constructor(target: T) {
    this.target = shallowRef(target)
    this.subscribers = []
  }

  subscribe = (callback: SubscribeFunction<T>) => {
    this.subscribers.push(callback)
  }

  set = (updated: T) => {
    const previous = this.target.value
    this.target.value = updated
    this.subscribers.forEach((callback) => {
      callback(previous, null)
      callback(null, updated)
    })
  }

  get = () => {
    return this.target.value
  }

  value = () => {
    return readonly(this.target)
  }
}
