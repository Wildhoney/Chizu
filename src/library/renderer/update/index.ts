import * as React from "react";

export default function useUpdate() {
  const [hash, rerender] = React.useReducer((index) => index + 1, 0);

  return React.useMemo(
    () => ({
      hash,
      rerender,
    }),
    [hash],
  );
}
