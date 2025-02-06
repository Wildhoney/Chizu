import { Stitched } from "../types/index.ts";
import { ViewDefinition } from "./types.ts";

export default function view<S extends Stitched>(
  definition: ViewDefinition<S>,
) {
  return definition;
}
