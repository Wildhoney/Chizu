import { immerable } from "immer";
import { Model } from "../types";
import { Nodeify } from "./types";
import { TraverseContext } from "traverse";

export class Node<T> {
  [immerable] = true;

  constructor(
    public value: T,
    public annotation: Annotation<T> | null,
  ) {}

  valueOf() {
    return this.value;
  }
}

// function isPrimitive(
//   value: unknown,
// ): value is string | number | boolean | null | undefined {
//   return value === null || typeof value !== "object";
// }

const originalWalk = traverse.prototype.walk;

// traverse.prototype.walk = function (root: any) {
//   // if the node is your wrapper, recurse into its value
//   if (root instanceof Node) {
//     return originalWalk.call(this, root.value);
//   }
//   return originalWalk.call(this, root);
// };

export function transform<M extends Model>(model: M): Nodeify<M> {
  return traverse(model).map(function (this: TraverseContext) {
    if (this.isRoot) return;
    if (this.node instanceof Node) return;

    if (this.node !== null && typeof this.node === "object") {
      const transformed = transform(this.node);
      const annotation =
        transformed instanceof Annotation ? transformed.value : null;
      const value =
        transformed instanceof Annotation
          ? transformed.value.value
          : transformed;
      this.update(new Node(value, annotation), true);
    } else {
      const annotation = this.node instanceof Annotation ? this.node : null;
      const value =
        this.node instanceof Annotation ? this.node.value : this.node;
      this.update(new Node(value, annotation), true);
    }
  });

  // if (value instanceof Annotation) {
  //   return new Node(value.value, value);
  // }

  // // if (value instanceof Node) {

  // //   // if (value.value instanceof Annotation) {
  // //   //   console.log('xxx');
  // //   // }

  // //   return value;
  // // }

  // if (isPrimitive(value)) return new Node(value, null);

  // if (Array.isArray(value)) {
  //   const node = new Node([], null);
  //   node.value = value.map((value) => nodeify(value));
  //   return node;
  // }

  // if (value && typeof value === "object") {
  //   const node = new Node({}, null);
  //   node.value = Object.fromEntries(
  //     Object.entries(value).map(([key, value]) => [key, nodeify(value)]),
  //   );

  //   return node;
  // }

  // return new Node(value, null);
}

// import traverse, { TraverseContext } from "traverse";
// import { Model } from "../types";
// import cloneDeep from "lodash/cloneDeep";
// import { Store } from "../hooks/types.ts";
// import * as React from "react";
// import get from "lodash/get";
// import { set } from "lodash";

import { Operations, Process } from "../types/index.ts";
import { Operation } from "./types.ts";
import traverse from "traverse";

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

// export function reconcile<M extends Model>(
//   model: M,
//   store: React.RefObject<Store>,
// ): M {
//   const updatedProduceModel: M = <M>{};
//   const updatedAnnotationStore: Store = {};

//   const reconciled = traverse(cloneDeep(model)).forEach(function (
//     this: TraverseContext,
//   ): void {
//     const path = this.path.join(".");
//     const currentAnnotation = this.node;
//     const existingAnnotation = get(store.current, path);
//     const key = this.path.join(".");

//     if (!key) return;

//     if (currentAnnotation instanceof Annotation) {
//       if (existingAnnotation) {
//         const merged = existingAnnotation.merge(currentAnnotation);
//         updatedAnnotationStore[key] = merged;
//         set(updatedProduceModel, key, merged.value);

//         return void this.update(merged.value);
//       } else {
//         updatedAnnotationStore[key] = this.node;
//         set(updatedProduceModel, key, this.node.value);

//         return void this.update(this.node.value);
//       }
//     }

//     if (existingAnnotation instanceof Annotation) {
//       const updated = existingAnnotation.update(currentAnnotation);
//       updatedAnnotationStore[key] = updated;
//       set(updatedProduceModel, key, updated.value);

//       return void this.update(updated.value);
//     }
//   });

//   return (store.current = updatedAnnotationStore), reconciled;
// }

// export function shadow<M extends object>(model: M, path: string[] = []): M {
//   return new Proxy(model, {
//     get(target, property, receiver) {
//       // Allow Immer internals through
//       if (typeof property === "symbol") {
//         return Reflect.get(target, property, receiver);
//       }

//       const value = Reflect.get(target, property, receiver);

//       // If we're inside an Immer draft, don't shadow-wrap
//       if (isDraft(target)) {
//         return value;
//       }

//       // Your shadow view
//       return {
//         value:
//           typeof value === "object" && value !== null
//             ? shadow(value as M, [...path, property as string])
//             : value,
//         pending: () => true,
//         path: [...path, property],
//       };
//     },

//     set(target, property, value, receiver) {
//       return Reflect.set(target, property, value, receiver);
//     },
//   }) as M;
// }

export function intersperse<T>(array: T[]): T[] {
  if (array.length === 0) return [];
  const result: T[] = [];
  for (let i = 0; i < array.length; i++) {
    result.push(array[i]);
    result.push("value" as T);
  }
  return result;
}

// export function ok<M>(model: M): M {
//   function wrap(value: unknown): unknown {
//     if (value instanceof Annotation) {
//       return { value };
//     }

//     if (Array.isArray(value)) {
//       return { value: value.map(wrap) };
//     }

//     if (typeof value === "object" && value !== null) {
//       const newObj: { [key: string]: unknown } = {};
//       for (const key in value) {
//         if (Object.prototype.hasOwnProperty.call(value, key)) {
//           newObj[key] = wrap((value as { [key: string]: unknown })[key]);
//         }
//       }
//       return { value: newObj };
//     }

//     return { value };
//   }

//   const newModel: { [key: string]: unknown } = {};
//   if (typeof model === "object" && model !== null) {
//     for (const key in model) {
//       if (Object.prototype.hasOwnProperty.call(model, key)) {
//         newModel[key] = wrap((model as { [key: string]: unknown })[key]);
//       }
//     }
//   }
//   return newModel as M;
// }
