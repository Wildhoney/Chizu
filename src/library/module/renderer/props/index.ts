import { useOptimisedEffect } from "../../../hooks/index.ts";
import { ModuleDefinition } from "../../../types/index.ts";
import { Props } from "./types.ts";
import * as React from "react";

export default function useProps<M extends ModuleDefinition>(props: Props<M>) {
  const currentProps = React.useRef<Readonly<M["Props"]>>(props.options.props);

  useOptimisedEffect((): void => {
    currentProps.current = props.options.props;
    props.update.rerender();
  }, [props.options.props]);

  return currentProps;
}
