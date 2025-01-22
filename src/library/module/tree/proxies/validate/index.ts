import { Model } from "../../../../types/index.ts";

export default function validate<M extends Model>(model: M, _path = ""): M {
  return new Proxy(model, {
    get(target, property) {
      if (typeof property === "symbol") return Reflect.get(target, property);
      return false;
      // return pending.includes(property)
      //   ? State.Pending
      //   : Reflect.get(target, property);
    },
  });
}
