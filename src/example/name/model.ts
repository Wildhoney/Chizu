import { create } from "../../library/index.ts";
import { Model } from "./types.ts";

export default create.model<Model>({
  name: null,
  isValid: false,
});
