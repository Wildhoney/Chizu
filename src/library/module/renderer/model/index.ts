import { ModuleDefinition } from "../../../types/index.ts";
import { Props } from "./types.ts";
import { Models } from "./utils.ts";
import * as React from "react";

export default function useModel<M extends ModuleDefinition>(props: Props<M>) {
  const model = React.useMemo(() => props.options.model ?? {}, []);

  return React.useRef<Models<M["Model"]>>(new Models(model, model));
}
