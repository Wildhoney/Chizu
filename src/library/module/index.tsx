import Renderer from "../module/renderer/index.ts";
import { ModuleDefinition } from "../types/index.ts";
import { UseOptions } from "./types.ts";
import * as React from "react";

export default function Scope<M extends ModuleDefinition>(
  options: UseOptions<M>,
): React.ReactNode {
  return <Renderer<M> options={options} />;
}
