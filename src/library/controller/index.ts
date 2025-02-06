import { Stitched } from "../types/index.ts";
import { ControllerDefinition } from "./types.ts";

export default function controller<S extends Stitched>(
  definition: ControllerDefinition<S>,
) {
  return definition;
}
