import * as React from "react";

export default function useQueue() {
  return React.useRef<Set<Promise<void>>>(new Set());
}
