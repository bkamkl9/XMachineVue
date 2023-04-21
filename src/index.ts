import { reactive, ref } from "vue";

export function createMachine<T extends {}, K extends any[]>(schema: {
  state: () => T;
  actions: {
    [state: string]: {
      onEnter?: (this: {
        state: T;
        changeState: (state: string) => void;
        dispatch: (name: string, ...args: K) => void;
      }) => any;
      onLeave?: (this: {
        state: T;
        changeState: (state: string) => void;
        dispatch: (name: string, ...args: K) => void;
      }) => any;
      [action: string]:
        | ((
            this: {
              state: T;
              changeState: (state: string) => void;
              dispatch: (name: string, ...args: K) => void;
            },
            ...args: K
          ) => any)
        | undefined;
    };
  };
}) {
  const currentState = ref("");
  const reactiveState = reactive({ ...schema.state() }) as T;

  function changeState(state: string) {
    const thisCtx = { state: reactiveState, dispatch, changeState };
    schema.actions[currentState.value]?.onLeave?.call(thisCtx);
    currentState.value = state;
    schema.actions[state]?.onEnter?.call(thisCtx);
  }

  function dispatch(actionName: string, ...args: K) {
    const action = schema.actions[currentState.value][actionName];
    if (!action) throw new Error("Forbidden action!");

    return action.call(
      { state: reactiveState, dispatch, changeState },
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
