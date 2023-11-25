import { ShallowRef, readonly, shallowRef } from 'vue'

type SubscribeFunction<T> = (updated: T, previous: T) => any

export class Observer<T> {
  #subscribers: SubscribeFunction<T>[]
  #target: ShallowRef<T>

  constructor(target: T) {
    this.#target = shallowRef(target)
    this.#subscribers = []
  }

  public subscribe(callback: SubscribeFunction<T>) {
    this.#subscribers.push(callback)
  }

  public set(value: T) {
    this.#subscribers.forEach((callback) => callback(this.#target.value, value))
    this.#target.value = value
  }

  public get() {
    return this.#target.value
  }

  public get value() {
    return readonly(this.#target)
  }
}
