import { Actions, Model, Parameters, Routes } from "../types/index.ts";
import { ControllerDefinition } from "./types.ts";

export default function controller<
  M extends Model,
  A extends Actions,
  R extends Routes,
  P extends Parameters = undefined,
>(definition: ControllerDefinition<M, A, R, P>) {
  return definition;
}
