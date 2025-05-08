import { ModuleDefinition } from "../../../types/index.ts";
import { Props } from "./types.ts";
import { Models } from "./utils.ts";
import * as React from "react";

export default function useModel<M extends ModuleDefinition>(props: Props<M>) {
  return React.useRef<Models<M["Model"]>>(
    new Models(props.options.model, props.options.model),
  );
}
