import * as React from "react";

export default function useElements() {
  const customElement = React.useRef<null | HTMLElement>(null);

  return React.useMemo(() => {
    return { customElement };
  }, []);
}
