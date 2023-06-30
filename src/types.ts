export type OmitThis<T extends (...args: any) => any> = (...args: Parameters<T>) => ReturnType<T>

export type ObjKeys<T> = (keyof T)[]

export type StateTree = { [key: string]: any }

export type ThisContext<S, SS, K extends keyof SS> = {
  state: S
  resetState: () => void
  changeState: (state: keyof SS) => void
} & Omit<SS[K], 'onEnter' | 'onLeave'>

export type StatesTree<S, SS> = {
  [k in keyof SS]: {
    [ka in keyof SS[k]]: SS[k][ka] extends (...args: infer P) => infer R
      ? (this: ThisContext<S, SS, k>, ...args: P) => R
      : never
  } & SS[k]
}

export type StoreOptions<S, SS> = {
  state: () => S
  states: StatesTree<S, SS>
}
