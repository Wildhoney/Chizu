import { useRef } from "react";
import { useOptimisedMemo } from "../../../hooks/index.ts";
import { ModuleDefinition } from "../../../types/index.ts";
import { Props } from "./types.ts";
import { ControllerInstance } from "../../../controller/types.ts";

export default function useController<M extends ModuleDefinition>(
  props: Props<M>,
) {
  const controller = useRef<null | ControllerInstance<M>>(null);

  if (controller.current == null) {
    controller.current = props.options.using.actions(props.actions.controller);
  }

  return useOptimisedMemo(() => {
    if (controller.current) {
      const actions = Object.entries(controller.current);
      actions.forEach(([name, ƒ]) => props.dispatchers.attach(name, ƒ));
      return controller.current;
    }
  }, []);
}
