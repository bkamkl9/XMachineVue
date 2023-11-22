import { MACHINE_SCHEMA, MACHINE_BODY } from '../types/state.ts'
import { Ref, ref } from 'vue'
import { ReactiveState } from './reactive-state.ts'

export class State<S extends {}, R extends {}> {
  public machine_body: MACHINE_BODY<S, R>
  public current_state: Ref<keyof S>
  private reactive_state: ReactiveState<R>

  constructor(schema: MACHINE_SCHEMA<S, R>, initial: keyof S, reactiveState: ReactiveState<R>) {
    this.reactive_state = reactiveState
    this.current_state = ref(initial) as Ref<keyof S>
    this.machine_body = this.createMachineBody(schema)
  }

  private createActionThisContext() {
    return {
      $changeState: this.changeCurrentState,
      $reactive: this.reactive_state.reactive_state,
      $resetReactive: this.reactive_state.resetReactive,
    }
  }

  /**
   * Add wrapper functions on top of state methods to prevent
   * executing action while incorrect state is active.
   */
  private createMachineBody(schema: MACHINE_SCHEMA<S, R>) {
    const new_schema = { ...schema } as MACHINE_BODY<S, R>

    for (const state in new_schema) {
      for (const action in new_schema[state]) {
        const context = { ...schema[state], ...this.createActionThisContext() }
        const wrapped = (...args: any[]) => {
          const INCORRECT_STATE_ERR = `INCORRECT STATE: ${state}.${action} cannot be executed.`
          if (this.current_state.value !== state) throw new Error(INCORRECT_STATE_ERR)
          return new_schema[state][action].call(context, ...args)
        }
        new_schema[state][action] = wrapped
      }
    }

    return new_schema
  }

  public changeCurrentState(state: keyof S) {
    this.current_state.value = state
  }
}
