import { Actions, Model, Routes } from "../types/index.ts";
import { ViewDefinition } from "./types.ts";

export default function view<
  M extends Model,
  A extends Actions,
  R extends Routes,
>(name: TemplateStringsArray) {
  return (definition: ViewDefinition<M, A, R>) => {
    return definition;
  };
}
