import { Process } from "./types.ts";
import * as React from "react";

export default function useProcess() {
  return React.useRef<null | Process>(null);
}
