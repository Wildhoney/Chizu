import { ComponentChildren } from "preact";
import { Actions, Model, Routes, State } from "../types/index.ts";

export type Validation<M extends Model> = {
  [K in keyof M]: M[K] extends Model ? Validation<M[K]> : State;
};

export type ViewActions<
  M extends Model,
  A extends Actions,
  R extends Routes,
> = {
  validate<T>(ƒ: (model: Validation<M>) => T): T;
  dispatch(event: A): void;
  navigate(route: R): void;
};

type ViewArgs<M extends Model, A extends Actions, R extends Routes> = {
  model: M;
  element: null | HTMLElement;
  actions: ViewActions<M, A, R>;
};

export type ViewDefinition<
  M extends Model,
  A extends Actions,
  R extends Routes,
> = (actions: ViewArgs<M, A, R>) => ComponentChildren;
