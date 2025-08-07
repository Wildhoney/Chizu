
export class Draft<T> {
  constructor(public value: T) {}
}

export class State {
  static Op = {
    Add: 1,
    Remove: 2,
    Update: 4,
    Move: 8,
    Replace: 16,
  };

  static Draft<T>(value: T): Draft<T> {
    return new Draft(value);
  }
}

export type Action = Lifecycle | symbol | string | number;

export class Lifecycle {
  static Mount = Symbol("lifecycle/mount");
  static Node = Symbol("lifecycle/node");
  static Derive = Symbol("lifecycle/derive");
  static Error = Symbol("lifecycle/error");
  static Unmount = Symbol("lifecycle/unmount");
}

export type Pk<T> = undefined | symbol | T;

export type Task = PromiseWithResolvers<void>;

export type Process = symbol;

export type Op = number;

export type Model = object;

export type Actions = unknown;



export type Context<Model, Actions> = {
  model: Model;
  actions: {
    produce(ƒ: (draft: Model) => void): Model;
    dispatch: (action: Actions) => void;
    annotate: <T>(value: T, operation: State.Op[]) => T;
    consume: <T>(action: any, ƒ: (value: T) => React.ReactNode) => T;
  };
};