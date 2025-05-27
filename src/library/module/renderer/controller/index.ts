import { useOptimisedMemo } from "../../../hooks/index.ts";
import { ModuleDefinition } from "../../../types/index.ts";
import { Props } from "./types.ts";

export default function useController<M extends ModuleDefinition>(
  props: Props<M>,
) {
  return useOptimisedMemo(() => {
    const controller = props.options.controller?.(props.actions.controller);
    if (!controller) return;
    const actions = Object.entries(controller);
    actions.forEach(([name, ƒ]) => props.dispatchers.attach(name, ƒ));
    return controller;
  }, []);
}
