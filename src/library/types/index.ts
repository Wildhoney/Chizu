export class Draft<T> {
  constructor(public value: T) {}
}

export class State {
  static Operation = {
    Adding: 1,
    Removing: 2,
    Updating: 4,
    Moving: 8,
    Replacing: 16,
    Sorting: 32,
  };

  static Draft<T>(value: T): Draft<T> {
    return new Draft(value);
  }
}

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

export type Operation = number;

export type Operations<T> = (Operation | Draft<T>)[];

export type Model<M = Record<string, unknown>> = M;

export const PayloadKey = Symbol("payload");

export type Payload<T = unknown> = string & { [PayloadKey]: T };

export type Props = Record<string, unknown>;

export type Action = symbol | string;

export type Actions = Record<
  Action,
  (context: Context<unknown, unknown>, payload?: unknown) => void
>;

export type Context<M extends Model, A extends Actions> = {
  model: M;
  signal: AbortSignal;
  actions: {
    produce(ƒ: (draft: M) => void): M;
    dispatch(action: Action): void;
        annotate<T>(value: T, operations: Operations<T>): T;
  };
};
