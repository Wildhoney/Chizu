import { Actions, Model } from "../types/index.ts";
import { ModuleOptions } from "./types.ts";

export class Module<M extends Model, A extends Actions> {
  public meta: ModuleOptions<M, A>;

  constructor(options: any) {
    this.meta = options;
  }
}

export default function module<M extends Model, A extends Actions>(
  options: ModuleOptions<M, A>,
) {
  return new Module(options);
}
