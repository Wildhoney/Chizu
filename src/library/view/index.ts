import { Actions, Model } from "../types/index.ts";
import { ViewDefinition } from "./types.ts";

export default function view<M extends Model, A extends Actions>(
  name: TemplateStringsArray,
) {
  return (definition: ViewDefinition<M, A>) => {
    return definition;
  };
}
