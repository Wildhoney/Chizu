import { ReactNode } from "react";

export type ErrorHandler = (error: Error) => void;

export type Props = {
  handler: ErrorHandler;
  children?: ReactNode;
};
