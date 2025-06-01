import { Models } from "../../module/renderer/model/utils.ts";
import { Meta, ModuleDefinition, Process } from "../../types/index.ts";
import { meta } from "../index.ts";
import { Annotation, config } from "./utils.ts";
import get from "lodash/get";
import traverse, { TraverseContext } from "traverse";

/**
 * Produces a new model by applying a series of patches to the given model.
 * This function uses Immer to handle immutable updates and applies additional
 * processing for `State` instances within the patches.
 *
 * @template M - The type of the model, extending `ModuleDefinition["Model"]`.
 * @param model - The initial model to be updated.
 * @param process - The process associated with the `State` instances, or `null` if no process is provided.
 * @param ƒ - A function that mutates the model draft to produce the desired changes.
 * @returns {Models<M>} A `Models` instance containing the updated model and its draft.
 */
export function update<M extends ModuleDefinition["Model"]>(
  models: Models<M>,
  process: Process,
  ƒ: (draft: M, meta: Meta) => void,
): Models<M> {
  function stateless(model: M): M {
    return traverse(model).forEach(function (this: TraverseContext): void {
      if (this.key === config.annotations) {
        this.block();
        return;
      }

      if (this.node instanceof Annotation) {
        this.update(this.node.value);
      }
    });
  }

  function stateful(model: M): M {
    return traverse(model).forEach(function (this: TraverseContext): void {
      if (this.key === config.annotations) {
        this.block();
        return;
      }

      if (this.node instanceof Annotation) {
        const object = typeof this.node.value === "object";

        const path = [
          ...(object ? this.path : this.path.slice(0, -1)),
          config.annotations,
        ];

        const annotations: Annotation<M>[] = get(models.stateful, path) ?? [];
        const state = this.node.attach(process);

        if (object) {
          this.update(
            {
              ...this.node.value,
              [config.annotations]: [state, ...annotations],
            },
            true,
          );
        } else {
          if (this.parent)
            this.parent.node[config.annotations] = [state, ...annotations];
          this.update(this.node.value, true);
        }
      }
    });
  }

  const handler = (model: M): void => ƒ(model, model[meta]);

  return new Models<M>(
    stateless(config.immer.produce(models.stateless, handler)),
    stateful(config.immer.produce(models.stateful, handler)),
  );
}

/**
 * Cleans up the model by removing states associated with a specific process.
 *
 * @template M - The type of the model, extending `ModuleDefinition["Model"]`.
 * @param models - The `Models` instance containing the model and its draft.
 * @param process - The process whose associated states should be removed.
 * @returns {Models<M>} The updated `Models` instance with the states cleaned up.
 */
export function cleanup<M extends ModuleDefinition["Model"]>(
  models: Models<M>,
  process: Process,
): Models<M> {
  const stateful = traverse(models.stateful).forEach(function (
    this: TraverseContext,
  ): void {
    if (this.key === config.annotations) {
      this.block();
      return;
    }

    if (this.node && this.node[config.annotations]) {
      const annotations: Annotation<M>[] = this.node[config.annotations];

      this.update(
        {
          ...this.node,
          [config.annotations]: annotations.filter(
            (state) => state.process !== process,
          ),
        },
        true,
      );
    }
  });

  return new Models<M>(models.stateless, stateful);
}
