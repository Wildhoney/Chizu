import { Actions, Model, Routes } from "../types/index.ts";
import { ModuleOptions } from "./types.ts";

export class Module<M extends Model, A extends Actions, R extends Routes> {
  public meta: ModuleOptions<M, A, R>;

  constructor(options: ModuleOptions<M, A, R>) {
    this.meta = options;
  }
}

export default function module<
  M extends Model,
  A extends Actions,
  R extends Routes,
>(options: ModuleOptions<M, A, R>) {
  return new Module(options);
}
