import { Draft } from "immer";
import { Model, Operation, Process } from "../types/index.ts";
import traverse, { TraverseContext } from "traverse";
import cloneDeep from "lodash/cloneDeep";

export class Annotation<T> {
  constructor(
    public value: T,
    public operations: (Operation | Draft<T>)[],
    public process: Process
  ) {}
}

export function createAnnotation<T>(
  value: T,
  operations: (Operation | Draft<T>)[] = [],
  process: Process
): T {
  return new Annotation<T>(value, operations, process) as T;
}

export function stripAnnotations<M extends Model>(model: M): M {
  return traverse(cloneDeep(model)).forEach(function (this: TraverseContext): void {
    if (this.node instanceof Annotation) {
      return this.node.value;
    }
  });
}
