import { ControllerActions } from "../../controller/types.ts";
import { Actions, Model, Routes } from "../../types/index.ts";
import { ModuleOptions } from "../types.ts";
import { JSX } from "preact";
import { ViewActions } from "../../view/types.ts";
import { produceWithPatches } from "immer";
import Optimistic from "../../model/state/index.ts";

export type Props<M extends Model, A extends Actions, R extends Routes> = {
  moduleOptions: ModuleOptions<M, A, R> & {
    elementName: keyof JSX.IntrinsicElements;
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

type ProduceWithPatches = ReturnType<typeof produceWithPatches>;

export type ControllerGeneratorAction<_M extends Model> =
  | undefined
  | Generator<
      () => Promise<any> | Optimistic<any>,
      ProduceWithPatches,
      [string, string]
    >;
