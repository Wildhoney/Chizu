import { Model, State } from "../../types";
import { validatable } from "./utils";

export class Models<M extends Model> {
  constructor(
    public stateless: M,
    public stateful: M = stateless,
  ) {}

  get validatable(): Validatable<M> {
    return validatable(this.stateful);
  }
}

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
