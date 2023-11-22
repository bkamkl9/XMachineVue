import type { Obj } from '../types/primitive'
import { UnwrapNestedRefs, reactive } from 'vue'

export class ReactiveState<R extends Obj> {
  private initial_reactive_state: R
  public reactive_state: UnwrapNestedRefs<R>

  constructor(initial: R) {
    this.initial_reactive_state = initial
    this.reactive_state = reactive(initial)
  }

  public resetReactive() {
    // TODO: To be implemented
    console.log(this.initial_reactive_state)
  }
}
