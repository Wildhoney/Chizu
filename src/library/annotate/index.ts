import { Operations, Process } from "../types/index.ts";
import { Annotation } from "./utils.ts";

export default function annotate<T>(
  value: T,
  operations: Operations<T>,
  process: Process,
) {
  return new Annotation<T>(value, operations, process) as unknown as T;
}
