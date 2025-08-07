import { useRef } from "react";
import { ModuleDefinition } from "../../../types/index.ts";
import { Props } from "./types.ts";
import { useOptimisedEffect } from "../../../hooks/index.ts";

export default function useProps<M extends ModuleDefinition>(props: Props<M>) {
  const object = useRef<M["Props"]>(props.options.using.props);

  useOptimisedEffect((): void => {
    object.current = props.options.using.props;
  }, [props.options.using.props]);

  return object;
}
