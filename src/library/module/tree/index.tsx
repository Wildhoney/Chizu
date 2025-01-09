import { ComponentChildren } from "preact";
import { useEffect, useId, useMemo, useRef, useState } from "preact/hooks";
import { Actions, Model, Routes } from "../../types/index.ts";
import { Props } from "./types.ts";
import { memo } from "preact/compat";

function Tree<M extends Model, A extends Actions, R extends Routes>({
  moduleOptions,
}: Props<M, A, R>): ComponentChildren {
  const id = useId();
  const isMountInvoked = useRef<boolean>(false);
  const [model, setModel] = useState<M>(moduleOptions.model);
  const [element, setElement] = useState<HTMLElement | null>(null);

  const controller = useMemo(() => {
    return moduleOptions.controller({
      model,
      actions: {} as any,
      element,
    });
  }, [model, element]);

  useEffect((): void => {
    if (element && !isMountInvoked.current) {
      controller.mount?.({}).next();
      isMountInvoked.current = true;
    }
  }, [element, controller]);

  useEffect(() => {
    return () => controller.unmount?.().next();
  }, []);

  return (
    <moduleOptions.elementName ref={setElement}>
      {moduleOptions.view({
        model,
        actions: {} as any,
        element,
      })}
    </moduleOptions.elementName>
  );
}

export default memo(Tree, () => true);
