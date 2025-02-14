import { Module } from "../../types/index.ts";
import * as React from "react";
import { Props } from "./types.ts";

export default function useAttributes<M extends Module>(props: Props<M>) {
  const attributes = React.useRef<M["Attributes"]>(props.options.attributes);

  React.useEffect((): void => {
    attributes.current = props.options.attributes;
    props.update.rerender();
  }, [props.options.attributes]);

  return attributes;
}
