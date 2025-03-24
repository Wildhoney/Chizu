import { Props } from "./types";
import createCache, { EmotionCache } from "@emotion/cache";
import * as React from "react";

export default function useElements(props: Props) {
  const customElement = React.useRef<null | HTMLElement>(null);
  const shadowBoundary = React.useRef<null | ShadowRoot>(null);
  const styleCache = React.useRef<null | EmotionCache>(null);

  React.useLayoutEffect(() => {
    if (customElement.current && !shadowBoundary.current) {
      shadowBoundary.current = customElement.current.attachShadow({
        mode: "open",
      });

      const cache = createCache({
        key: "updateatsomepoint",
        container: shadowBoundary.current,
      });

      styleCache.current = cache;
      props.update.rerender();
    }
  }, []);

  return React.useMemo(() => {
    return {
      customElement,
      shadowBoundary,
      styleCache,
    };
  }, []);
}
