import { create } from "../../library/index.ts";
import { Model } from "./types.ts";

export default create.model<Model>({
  kite: Math.floor(Math.random() * (6 - 1 + 1) + 1),
});
