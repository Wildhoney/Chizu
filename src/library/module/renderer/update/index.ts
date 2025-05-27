import { useOptimisedMemo } from "../../../hooks";
import * as React from "react";

export default function useUpdate() {
  const [hash, rerender] = React.useReducer((index) => index + 1, 0);

  return useOptimisedMemo(() => ({ hash, rerender }), [hash]);
}
