import {
  Attributes,
  Draft,
  Handlers,
  ModuleDefinition,
  Op,
  Process,
} from "../../../types/index.ts";
import { update } from "../../../utils/produce/index.ts";
import { annotate } from "../../../utils/produce/utils.ts";
import { Validatable } from "../model/types.ts";
import { Models } from "../model/utils.ts";
import * as Router from "../router/types.ts";
import { Props, UseActions } from "./types.ts";
import * as React from "react";

export default function useActions<M extends ModuleDefinition>(
  props: Props<M>,
): UseActions<M> {
  return React.useMemo(
    () => ({
      controller: {
        get model() {
          return props.model.current.stateful as Readonly<M["Model"]>;
        },
        get router() {
          return props.router.current as M["Query"] extends string
            ? Readonly<Router.Context<M["Query"]>>
            : null;
        },
        queue: [],
        handlers: props.options.props as Handlers<M["Props"]>,
        attributes: props.options.props as Attributes<M["Props"]>,
        actions: {
          annotate<T>(value: T, operations: (Op | Draft<T>)[]): T {
            return annotate(value, operations);
          },
          produce<M extends ModuleDefinition>(ƒ: (model: M["Model"]) => void) {
            return (
              models: Models<M["Model"]>,
              process: Process,
            ): Models<M["Model"]> => {
              return update(models, process, ƒ);
            };
          },
          dispatch([action, ...data]) {
            const task = Promise.withResolvers<void>();
            props.dispatchers.dispatch(action, data, task);
            return task.promise;
          },
        },
      },
      view: {
        get model() {
          return props.model.current.stateless as Readonly<M["Model"]>;
        },
        get validate() {
          return props.model.current.validatable as Validatable<
            Readonly<M["Model"]>
          >;
        },
        handlers: props.options.props as Handlers<M["Props"]>,
        attributes: props.options.props as Attributes<M["Props"]>,
        actions: {
          dispatch([action, ...data]) {
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
