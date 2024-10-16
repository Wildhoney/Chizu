import { Actions, Model } from "../types/index.ts";
import { ControllerDefinition } from "./types.ts";

export default function controller<M extends Model, A extends Actions>(
  name: TemplateStringsArray,
) {
  return (definition: ControllerDefinition<M, A>) => {
    return definition;
  };
}
