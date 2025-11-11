import { config } from "../hooks/utils.ts";
import { Model, Operations, Process } from "../types/index.ts";
import { Nodeify } from "./types.ts";
import { Annotation, intersperse, transform } from "./utils.ts";

export function annotate<T>(
  value: T,
  operations: Operations<T>,
  process: Process,
) {
  return new Annotation<T>(value, operations, process) as unknown as T;
}

// export function validateable<M extends Model>(model: M): Validateable<M> {
//   return shadow(model) as Validateable<M>;
// }

export class Models<M extends Model> {
  public shadow: Nodeify<M>;

  constructor(public model: M) {
    this.shadow = transform(model);
  }

  public produce(ƒ: (draft: M) => void): void {
    const [model, patches] = config.immer.produceWithPatches(this.model, ƒ);
    const interspersedPatches = patches.map((patch) => ({
      ...patch,
      path: intersperse(patch.path),
    }));

    this.model = model;
    this.shadow = transform(
      config.immer.applyPatches(this.shadow.value, interspersedPatches),
    );
  }
}

// Take the Models and the function that produces the new model and patches
// Apply the patches to the Models.model using config.immer.produceWithPatches
// Intersperse "value" into the path of each of the patch items
// Apply the update patches to the Models.shadow
// Iterate over the Models.shadow:
// If the value prop is instanceof Annotation then transfer the plain value to the "value" property
// Merge the Annotation with the annotation prop, or just set it if it's currently null.
