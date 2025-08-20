import { Store } from "../hooks/types.ts";
import { Model, Operations, Process } from "../types/index.ts";
import { Annotation, proxy } from "./utils.ts";

export default function annotate<T>(
  value: T,
  operations: Operations<T>,
  process: Process,
) {
  return new Annotation<T>(value, operations, process) as unknown as T;
}

export function validateable<M extends Model>(
  model: M,
  annotationStore: Store,
) {
  return proxy(model, annotationStore);
}
