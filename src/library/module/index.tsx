import Renderer from "../module/renderer/index.ts";
import { ModuleDefinition } from "../types/index.ts";
import { hash } from "../utils/index.ts";
import { UseOptions } from "./types.ts";
import * as React from "react";

function Scope<M extends ModuleDefinition>(
  options: UseOptions<M>,
): React.ReactNode {
  return <Renderer<M> options={options} />;
}

export default React.memo(Scope, (a, b) => hash(a) === hash(b)) as typeof Scope;
