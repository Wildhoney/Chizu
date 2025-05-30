import Renderer from "../module/renderer/index.ts";
import { ModuleDefinition } from "../types/index.ts";
import { hash } from "../utils/index.ts";
import { UseOptions } from "./types.ts";
import * as React from "react";

function Tree<M extends ModuleDefinition>(
  options: UseOptions<M>,
): React.ReactNode {
  const [hash, remount] = React.useReducer((index) => index + 1, 0);

  return <Renderer<M> key={hash} options={{ ...options, remount }} />;
}

export default React.memo(Tree, (a, b) => hash(a) === hash(b)) as typeof Tree;
