import { useOptimisedEffect } from "../../../hooks/index.ts";
import { Lifecycle, ModuleDefinition } from "../../../types/index.ts";
import { Props } from "./types.ts";

export default function useLifecycles<M extends ModuleDefinition>(
  props: Props<M>,
) {
  useOptimisedEffect((): void => {
    props.dispatchers.dispatch(Lifecycle.Derive, []);
  }, [props.options.using.props]);

  useOptimisedEffect((): (() => void) => {
    props.dispatchers.dispatch(Lifecycle.Mount, []);
    props.dispatchers.dispatch(Lifecycle.Node, [
      props.elements.customElement.current,
    ]);

    return () => props.dispatchers.dispatch(Lifecycle.Unmount, []);
  }, []);
}
