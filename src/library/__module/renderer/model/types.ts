import useModel from ".";
import { ModuleDefinition, State } from "../../../types/index.ts";
import { UseOptions } from "../../types.ts";

export type Props<M extends ModuleDefinition> = {
  options: UseOptions<M>;
};

export type UseModel = ReturnType<typeof useModel>;

export type Validate = {
  pending(): boolean;
  is(operation: State): boolean;
  draft<T>(): T;
};

export type Validatable<M> = {
  [K in keyof M]: M[K] extends object
    ? M[K] extends Array<infer U>
      ? Array<Validatable<U> & Validate> & Validate
      : Validatable<M[K]> & Validate
    : M[K] & Validate;
} & Validate;
