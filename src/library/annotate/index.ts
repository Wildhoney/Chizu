import { immerable } from "immer";
import { Model, Operations, Process } from "../types/index.ts";
import traverse, { TraverseContext } from "traverse";
import cloneDeep from "lodash/cloneDeep";

export class Annotation<T> {
  [immerable] = true;

  constructor(
    public value: T,
    public operations: Operations<T>,
    public process: Process,
  ) {}
}

export function plain<M extends Model>(model: M): M {
  return traverse(cloneDeep(model)).forEach(function (
    this: TraverseContext,
  ): void {
    if (this.node instanceof Annotation) {
      return this.node.value;
    }
  });
}
