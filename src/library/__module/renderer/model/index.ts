import { useOptimisedMemo } from "../../../hooks/index.ts";
import { Boundary, ModuleDefinition } from "../../../types/index.ts";
import { meta } from "../../../utils/index.ts";
import { Props } from "./types.ts";
import { Models } from "./utils.ts";
import * as React from "react";

export default function useModel<M extends ModuleDefinition>(props: Props<M>) {
  const model = useOptimisedMemo(() => {
    const model = props.options.using.model ?? {};
    return { ...model, [meta]: { boundary: Boundary.Default } };
  }, []);

  return React.useRef<Models<M["Model"]>>(new Models(model, model));
}
