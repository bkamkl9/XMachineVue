import { reactive, ref } from "vue";

type KeysOfUnion<T> = T extends T ? keyof T : never;

type MachineActions<T> = {
  [state: string]: {
    onEnter?: (this: MachineContext<T>) => any;
    onLeave?: (this: MachineContext<T>) => any;
    [action: string]:
      | ((this: MachineContext<T>, ...args: any[]) => any)
      | undefined;
  };
};

type MachineContext<T> = {
  state: T;
  changeState: (state: string) => void;
  dispatch: (name: string, ...args: any[]) => void;
};

export function createMachine<
  T extends {},
  A extends MachineActions<T>
>(schema: { state: () => T; actions: A }) {
  const currentState = ref("");
  const reactiveState = reactive({ ...schema.state() }) as T;

  type States = keyof A;

  function changeState(state: States) {
    const thisCtx = { state: reactiveState, dispatch, changeState };
    schema.actions[currentState.value]?.onLeave?.call(thisCtx as any);
    currentState.value = state as string;
    schema.actions[state]?.onEnter?.call(thisCtx as any);
  }

  function dispatch<Action extends KeysOfUnion<A[States]>>(
    actionName: Action extends string ? Action : never,
    ...args: any[]
  ) {
    const action = schema.actions[currentState.value][actionName as string];
    if (!action) throw new Error("Forbidden action!");

    return action.call(
      { state: reactiveState, dispatch: dispatch as any, changeState },
      ...args
    );
  }

  return {
    current: currentState,
    state: reactiveState,
    dispatch,
    changeState,
  };
}
