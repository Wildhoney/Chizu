import { Actions, Model, Parameters, Props, Routes } from "../types/index.ts";
import { ControllerDefinition } from "./types.ts";

export default function controller<
  M extends Model,
  A extends Actions,
  R extends Routes,
  P1 extends Props,
  P2 extends Parameters = undefined,
>(definition: ControllerDefinition<M, A, R, P1, P2>) {
  return definition;
}
