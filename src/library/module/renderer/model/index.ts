import { useOptimisedMemo } from "../../../hooks/index.ts";
import { ModuleDefinition } from "../../../types/index.ts";
import { Props } from "./types.ts";
import { Models } from "./utils.ts";
import * as React from "react";

export default function useModel<M extends ModuleDefinition>(props: Props<M>) {
  const model = useOptimisedMemo(() => props.options.model ?? {}, []);

  return React.useRef<Models<M["Model"]>>(new Models(model, model));
}
