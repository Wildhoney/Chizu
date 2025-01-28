import { Model } from "../../types/index.ts";
import { ModuleMutations } from "../tree/types.ts";

export default function validate<M extends Model>(
  model: M,
  mutations: ModuleMutations,
  _path = "",
): M {
  return new Proxy(model, {
    get(target, property) {
      if (typeof property === "symbol") return Reflect.get(target, property);

      const entries = Object.values(
        mutations,
      ).flat() as unknown as ModuleMutations[string]["mutations"];

      const states = new Set(
        entries
          .filter((mutation) => mutation.path.join(".").startsWith(property))
          .map((mutation) => mutation.state),
      );

      return [...states].reduce((acc, num) => acc ^ num, 0);
    },
  });
}
