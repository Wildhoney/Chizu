import { Actions, Model, ViewDefinition } from "../types/index.ts";

export default function view<M extends Model, A extends Actions>(
  name: TemplateStringsArray,
) {
  return (model: M, definition: ViewDefinition<M, A>) => {
    return definition;
  };
}
