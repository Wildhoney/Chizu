import { Lifecycle, ModuleDefinition } from "../../../types/index.ts";
import { Props } from "./types.ts";
import * as React from "react";

export default function useLifecycles<M extends ModuleDefinition>(
  props: Props<M>,
) {
  const invoked = React.useRef<boolean>(false);

  React.useEffect((): void => {
    props.dispatchers.dispatch(Lifecycle.Mount, []);
    props.dispatchers.dispatch(Lifecycle.Derive, [props.options.attributes]);
  }, [props.options.attributes]);

  React.useEffect(() => {
    if (invoked.current) {
      return;
    }

    invoked.current = true;
    return () => props.dispatchers.dispatch(Lifecycle.Unmount, []);
  }, []);
}
