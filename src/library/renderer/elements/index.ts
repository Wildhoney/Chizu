import * as React from "react";
import { Props } from "./types";

export default function useElements(props: Props) {
  const customElement = React.useRef<null | HTMLElement>(null);
  const shadowBoundary = React.useRef<null | ShadowRoot>(null);

  React.useLayoutEffect(() => {
    if (customElement.current && !shadowBoundary.current) {
      shadowBoundary.current = customElement.current.attachShadow({
        mode: "open",
      });

      props.update.rerender();
    }
  }, []);

  return React.useMemo(() => {
    return {
      customElement,
      shadowBoundary,
    };
  }, []);
}
