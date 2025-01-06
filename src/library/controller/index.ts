import { Actions, Model, Routes } from "../types/index.ts";
import { ControllerDefinition } from "./types.ts";

export default function controller<
  M extends Model,
  A extends Actions,
  R extends Routes,
>(name: TemplateStringsArray) {
  return (definition: ControllerDefinition<M, A, R>) => {
    return definition;
  };
}
