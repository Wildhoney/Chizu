import { ComponentChildren } from "preact";
import { Actions, Model, Parameters, Routes } from "../../types/index.ts";
import { Props } from "./types.ts";
import { memo } from "preact/compat";
import { useController } from "./utils.ts";

function Tree<
  M extends Model,
  A extends Actions,
  R extends Routes,
  P extends Parameters,
>({ moduleOptions }: Props<M, A, R>): ComponentChildren {
  const controller = useController<M, A, R, P>({ moduleOptions });

  return (
    <moduleOptions.elementName ref={controller.actions.attachElement}>
      {moduleOptions.view({
        model: controller.state.model,
        actions: controller.state.actions,
        element: controller.state.element,
      })}
    </moduleOptions.elementName>
  );
}

export default memo(Tree, () => true);
