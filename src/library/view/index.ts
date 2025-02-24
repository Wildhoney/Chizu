import { ModuleDefinition } from "../types/index.ts";
import { ViewDefinition } from "./types.ts";

export default function view<M extends ModuleDefinition>(definition: ViewDefinition<M>) {
  return definition;
}
