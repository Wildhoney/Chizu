import traverse, { TraverseContext } from "traverse";
import { Model } from "../types";
import cloneDeep from "lodash/cloneDeep";
import { Store } from "../hooks/types.ts";
import * as React from "react";
import get from "lodash/get";
import { set } from "lodash";

import { Operations, Process } from "../types/index.ts";
import { Operation, Validator } from "./types.ts";

export class Annotation<T> {
  public operations: Operation<T>[];

  constructor(
    public value: T,
    operations: Operations<T>,
    process: Process,
  ) {
    this.operations = operations.map((operation) => ({
      operation,
      process,
    }));
  }

  merge(annotation: Annotation<T>): Annotation<T> {
    this.value = annotation.value;
    this.operations.push(...annotation.operations);
    return this;
  }

  update(value: T): Annotation<T> {
    this.value = value;
    return this;
  }

  clean(process: Process) {
    this.operations = this.operations.filter(
      (operation) => operation.process !== process,
    );
  }
}

export function reconcile<M extends Model>(
  model: M,
  produceModel: React.RefObject<M>,
  annotationStore: React.RefObject<Store>,
): M {
  const updatedProduceModel: M = <M>{};
  const updatedAnnotationStore: Store = {};

  const reconciled = traverse(cloneDeep(model)).forEach(function (
    this: TraverseContext,
  ): void {
    const path = this.path.join(".");
    const annotation = get(annotationStore.current, path);
    const key = this.path.join(".");

    if (!key) return;

    if (this.node instanceof Annotation) {
      if (annotation) {
        const merged = annotation.merge(this.node);
        updatedAnnotationStore[key] = merged;
        set(updatedProduceModel, key, merged.value);

        return void this.update(merged.value);
      } else {
        updatedAnnotationStore[key] = this.node;
        set(updatedProduceModel, key, this.node.value);

        return void this.update(this.node.value);
      }
    }

    if (annotation instanceof Annotation) {
      const updated = annotation.update(this.node);
      updatedAnnotationStore[key] = updated;
      set(updatedProduceModel, key, updated.value);

      return void this.update(updated.value);
    }

    updatedAnnotationStore[key] = this.node;
  });

  return (
    (annotationStore.current = updatedAnnotationStore),
    (produceModel.current = updatedProduceModel),
    reconciled
  );
}

export function proxy<M extends Model>(
  model: M,
  annotationStore: Store,
  path: string[] = [],
): M | Validator {
  return new Proxy(model, {
    get(target, property, receiver) {
      const key = [...path, property].join(".");
      const record = annotationStore?.[key];
      const pending = (record?.operations.length ?? 0) > 0;

      if (property === "pending") {
        return () => pending;
      }

      const value = Reflect.get(target, property, receiver);

      if (typeof value === "object" && value !== null)
        return proxy(value as M, annotationStore, [
          ...path,
          property as string,
        ]);
      else
        return {
          pending: () => pending,
          path: [...path, property],
        };
    },
  }) as M | Validator;
}
