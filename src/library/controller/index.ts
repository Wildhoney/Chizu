import { Actions, ControllerDefinition, Model } from "../types/index.ts";

export default function controller<M extends Model, A extends Actions>(
  name: TemplateStringsArray,
) {
  return (model: M, definition: ControllerDefinition<M, A>) => {
    return definition;
  };
}
