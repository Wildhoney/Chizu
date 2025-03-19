import { ModuleDefinition } from "../../../types/index.ts";
import { Props } from "./types.ts";
import * as React from "react";

export default function useController<M extends ModuleDefinition>(
  props: Props<M>,
) {
  return React.useMemo(() => {
    const controller = props.options.controller(props.actions.controller);
    const actions = Object.entries(controller);
    actions.forEach(([name, ƒ]) => props.dispatchers.attach(name, ƒ));

    return controller;
  }, []);
}
