import { Dispatch, StateUpdater } from "preact/hooks";
import { ControllerInstance } from "../../controller/types.ts";
import { Actions, Model, Parameters, Routes } from "../../types/index.ts";
import { ModuleOptions } from "../types.ts";
import { JSX } from "preact";

export type Props<M extends Model, A extends Actions, R extends Routes> = {
  moduleOptions: ModuleOptions<M, A, R> & {
    elementName: JSX.IntrinsicElements;
  };
};

export type ModuleInstance<
  M extends Model,
  A extends Actions,
  P extends Parameters = undefined,
> = {
  id: string;
  controller: ControllerInstance<A, P>;
  model: M;
  setModel: Dispatch<StateUpdater<M>>;
};
