import * as React from "react";
import { Phase } from "./types";

export default function usePhase() {
  return React.useRef<number>(Phase.Uninitialised);
}
