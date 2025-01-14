import { ControllerActions } from "../../controller/types.ts";
import { Actions, Model, Routes } from "../../types/index.ts";
import { ModuleOptions } from "../types.ts";
import { JSX } from "preact";
import { ViewActions } from "../../view/types.ts";

export type Props<M extends Model, A extends Actions, R extends Routes> = {
  moduleOptions: ModuleOptions<M, A, R> & {
    elementName: JSX.IntrinsicElements;
  };
};

export type UseBindActionsReturn<
  M extends Model,
  A extends Actions,
  R extends Routes,
> = {
  controller: ControllerActions<M, A, R>;
  view: ViewActions<M, A, R>;
};
