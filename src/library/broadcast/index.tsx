import type { BroadcastContext } from "./types.ts";
import { Props } from "./types.ts";
import EventEmitter from "eventemitter3";
import * as React from "react";

const Context = React.createContext<BroadcastContext>({
  instance: new EventEmitter(),
});

export function useBroadcast() {
  return React.useContext(Context);
}

/**
 * Note: only needed if you want to create a new broadcast context, useful for
 * libraries that want to provide their own broadcast context without intefering
 * with the app's broadcast context.
 *
 * @param param0 - { children }: Props
 * @returns {React.ReactNode}
 */
export function Broadcaster({ children }: Props): React.ReactNode {
  const context = React.useMemo(
    () => ({
      instance: new EventEmitter(),
    }),
    [],
  );

  return <Context.Provider value={context}>{children}</Context.Provider>;
}
