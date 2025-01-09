import { ComponentChildren } from "preact";
import { Actions, Model, Routes } from "../../types/index.ts";
import { Props } from "./types.ts";
import { memo } from "preact/compat";
import { useController } from "./utils.ts";

function Tree<M extends Model, A extends Actions, R extends Routes>({
  moduleOptions,
}: Props<M, A, R>): ComponentChildren {
  const controller = useController<M, A, R>({ moduleOptions });

  return (
    <moduleOptions.elementName ref={controller.actions.setElement}>
      {moduleOptions.view({
        model: controller.state.model,
        actions: controller.actions.viewActions,
        element: controller.state.element,
      })}
    </moduleOptions.elementName>
  );
}

export default memo(Tree, () => true);
