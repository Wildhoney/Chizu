import { createContext, useContext } from "react";
import { ErrorHandler, Props } from "./types";

export const ErrorContext = createContext<ErrorHandler | undefined>(undefined);

export function useActionError() {
  return useContext(ErrorContext);
}

export function ActionError({ handle, children }: Props) {
  return (
    <ErrorContext.Provider value={handle}>{children}</ErrorContext.Provider>
  );
}
