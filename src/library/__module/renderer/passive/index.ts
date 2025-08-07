import { useRef } from "react";

export default function usePassive() {
  return useRef<number>(0);
}
