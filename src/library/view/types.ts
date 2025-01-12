import { ComponentChildren } from "preact";
import { Actions, Model, Routes, State } from "../types/index.ts";

type Validation<M extends Model> = {
  [K in keyof M]: M[K] extends Model ? Validation<M[K]> : State;
};

type ViewArgs<M extends Model, A extends Actions, R extends Routes> = {
  model: M;
  element: null | HTMLElement;
  actions: {
    validate(ƒ: (model: Validation<M>) => boolean): void;
    dispatch(event: A): void;
    navigate(route: R): void;
  };
};

export type ViewDefinition<
  M extends Model,
  A extends Actions,
  R extends Routes,
> = (actions: ViewArgs<M, A, R>) => ComponentChildren;
