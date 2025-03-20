import { Mutations } from "./types";
import * as React from "react";

export default function useMutations() {
  return React.useRef<Mutations>(new Set());
}
