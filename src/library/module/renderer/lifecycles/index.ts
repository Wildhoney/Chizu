import { Lifecycle, ModuleDefinition } from "../../../types/index.ts";
import { Props } from "./types.ts";
import * as React from "react";

export default function useLifecycles<M extends ModuleDefinition>(
  props: Props<M>,
) {
  const invoked = React.useRef<boolean>(false);

  React.useLayoutEffect((): void => {
    props.dispatchers.dispatch(Lifecycle.Derive, [
      props.options.props,
      props.router.current,
    ]);
  }, [
    props.options.props,
    props.router.current?.location,
    props.router.current?.params,
    props.router.current?.search?.[0],
  ]);

  React.useLayoutEffect(() => {
    if (invoked.current) {
      return;
    }

    invoked.current = true;

    props.dispatchers.dispatch(Lifecycle.Mount, []);
    props.dispatchers.dispatch(Lifecycle.Node, [
      props.elements.customElement.current,
    ]);

    return () => props.dispatchers.dispatch(Lifecycle.Unmount, []);
  }, []);
}
