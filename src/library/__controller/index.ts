import { ModuleDefinition } from "../types/index.ts";
import { ControllerDefinition } from "./types.ts";

export default function controller<M extends ModuleDefinition>(
  definition: ControllerDefinition<M>,
) {
  return definition;
}
