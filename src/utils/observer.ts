type SubscribeFunction<T> = (updated: T, previous: T) => any

export class Observer<T> {
  #subscribers: SubscribeFunction<T>[]
  #target: T

  constructor(target: T) {
    this.#target = target
    this.#subscribers = []
  }

  public subscribe(callback: SubscribeFunction<T>) {
    this.#subscribers.push(callback)
  }

  public set(value: T) {
    this.#subscribers.forEach((callback) => callback(this.#target, value))
    this.#target = value
  }

  public get() {
    return this.#target
  }
}
