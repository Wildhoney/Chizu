import { ModuleDefinition } from "../../../types/index.ts";
import { Props } from "./types.ts";
import * as React from "react";

export default function useModel<M extends ModuleDefinition>(props: Props<M>) {
  return React.useRef<M["Model"]>(props.options.model);
}
