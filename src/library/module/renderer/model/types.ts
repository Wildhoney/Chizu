import useModel from ".";
import { ModuleDefinition, Operation } from "../../../types/index.ts";
import { UseOptions } from "../types.ts";

export type Props<M extends ModuleDefinition> = {
  options: UseOptions<M>;
};

export type UseModel = ReturnType<typeof useModel>;

export type Validate = { is(operation: Operation): boolean };

export type Validatable<M> = {
  [K in keyof M]: M[K] extends object
    ? M[K] extends Array<any>
      ? M[K] & Validate
      : Validatable<M[K]> & Validate
    : M[K];
} & Validate;
