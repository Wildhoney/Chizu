import { useOptimisedMemo } from "../../../hooks";
import * as React from "react";

export default function useElements() {
  const customElement = React.useRef<null | HTMLElement>(null);

  return useOptimisedMemo(() => {
    return { customElement };
  }, []);
}
