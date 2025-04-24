import { ModuleDefinition } from "../../../types/index.ts";
import { Metrics, Props } from "./types.ts";
import * as React from "react";

export default function useLogger<M extends ModuleDefinition>(props: Props<M>) {
  return React.useMemo(
    () => ({
      output(_metrics: Metrics): void {
        const node = props.elements.customElement.current;
        console.groupCollapsed(
          `%cRendered`,
          `background: rgb(217, 235, 240); color: rgb(0, 51, 102); border-radius: 2px; padding: 0 5px`,
          node,
        );
        console.groupEnd();
      },
    }),
    [],
  );
}
