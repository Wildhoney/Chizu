import { Models } from "../../module/renderer/model/utils.ts";
import { ModuleDefinition, Process } from "../../types/index.ts";
import { State, config } from "./utils.ts";
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
  model: M,
  process: Process,
  ƒ: (model: M) => void,
): Models<M> {
  function primitives(model: M): M {
    return traverse(model).forEach(function (this: TraverseContext) {
      if (this.node instanceof State) {
        this.update(this.node.value);
      }
    });
  }

  function state(model: M): M {
    return traverse(model).forEach(function (this: TraverseContext): void {
      if (this.node instanceof State) {
        const object = typeof this.node.value === "object";
        const states =
          (object ? this.node.value : this.parent?.node)?.[config.states] ?? [];
        const state = this.node.bind(process);

        if (object) {
          this.update(
            {
              ...this.node.value,
              [config.states]: [...states, state],
            },
            true,
          );
        } else {
          if (this.parent) this.parent.node[config.states] = [...states, state];
          this.update(this.node.value);
        }
      }
    });
  }

  const stateless = config.immer.produce(model, ƒ);
  const stateful = config.immer.produce(model, ƒ);

  return new Models<M>(primitives(stateless), state(stateful));
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
    if (this.node && this.node[config.states]) {
      const states: State<M>[] = this.node[config.states];

      this.update(
        {
          ...this.node,
          [config.states]: states.filter((state) => state.process !== process),
        },
        true,
      );
    }
  });

  return new Models<M>(models.stateless, stateful);
}
