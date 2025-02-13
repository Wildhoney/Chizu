import { Actions, Lifecycle, Stitched } from "../types/index.ts";

export type ControllerActions<S extends Stitched> = {
  io<T>(ƒ: () => T): () => T;
  produce(ƒ: (draft: S["Model"]) => void): void;
  dispatch(event: S["Actions"]): void;
  navigate(route: S["Routes"]): void;
};

export type ControllerArgs<S extends Stitched> = {
  model: S["Model"];
  actions: ControllerActions<S>;
};

export type ControllerDefinition<S extends Stitched> = (
  controller: ControllerArgs<S>,
) => ControllerInstance<S>;

export type ControllerInstance<S extends Stitched> = {
  [Lifecycle.Mount]?(parameters: S["Routes"]): void;
  [Lifecycle.Derive]?(attributes: S["Props"]): void;
  [Lifecycle.Tree]?(): void;
  [Lifecycle.Unmount]?(): void;
} & Partial<Handlers<S["Actions"]>>;

type Handlers<A extends Actions> = {
  [K in A[0]]: (payload: Payload<A, K>) => Generator<any, any, never>;
};

type Payload<A extends Actions, K> = A extends [K, infer P] ? P : never;
