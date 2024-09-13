import { produce } from "immer";
import { DraftFn, FnType } from "./types";

export abstract class Controller<Model> {
  protected abstract model: Model;

  protected produce(fn: DraftFn<Model>) {
    return produce(this.model, fn);
  }

  protected io(fn: FnType) {
    return fn;
  }
}
