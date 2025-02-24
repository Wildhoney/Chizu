import { Phase } from "./types";
import * as React from "react";

export default function usePhase() {
  return React.useRef<number>(Phase.Uninitialised);
}
