import { useOptimisedMemo } from "../../../hooks/index.ts";
import {
  Boundary,
  Draft,
  Meta,
  ModuleDefinition,
  Op,
  Process,
  Context,
  ContextTypes,
} from "../../../types/index.ts";
import { meta } from "../../../utils/index.ts";
import { update } from "../../../utils/produce/index.ts";
import { annotate } from "../../../utils/produce/utils.ts";
import { Validatable } from "../model/types.ts";
import { Models } from "../model/utils.ts";
import { Props, UseActions } from "./types.ts";

export default function useActions<M extends ModuleDefinition>(
  props: Props<M>,
): UseActions<M> {
  return useOptimisedMemo(
    () => ({
      controller: {
        get model() {
          return props.model.current.stateless as Readonly<M["Model"]>;
        },
        get props() {
          return props.props.current as Readonly<M["Props"]>;
        },
        actions: {
          annotate<T>(value: T, operations: (Op | Draft<T>)[]): T {
            return annotate(value, operations);
          },
          produce<M extends ModuleDefinition>(
            ƒ: (model: M["Model"], meta: Meta) => void,
          ) {
            return (
              models: Models<M["Model"]>,
              process: Process,
            ): Models<M["Model"]> => {
              return update(models, process, ƒ);
            };
          },
          dispatch([action, ...data]) {
            if (action == null) return Promise.reject();
            const task = Promise.withResolvers<void>();
            props.dispatchers.dispatch(action, data, task);
            return task.promise;
          },
          context<C extends Context>(context: C): ContextTypes<C> {
            const keys = Object.keys(context);
            props.context.use.current = context;
            props.context.update();

            return keys.reduce(
              (accum, key) => ({
                ...accum,
                get [key]() {
                  return props.context.values.current[key];
                },
              }),
              {} as ContextTypes<C>,
            );
          },
        },
      },
      view: {
        get model() {
          return props.model.current.stateless as Readonly<M["Model"]>;
        },
        get props() {
          return props.props.current as Readonly<M["Props"]>;
        },
        get validate() {
          return props.model.current.validatable as Validatable<
            Readonly<M["Model"]>
          >;
        },
        boundary: {
          is(boundary: Boundary): boolean {
            return props.model.current.stateless[meta].boundary === boundary;
          },
        },
        actions: {
          dispatch([action, ...data]) {
            if (action == null) return Promise.reject();
            const task = Promise.withResolvers<void>();
            props.dispatchers.dispatch(action, data, task);
            return task.promise;
          },
        },
      },
    }),
    [],
  );
}
