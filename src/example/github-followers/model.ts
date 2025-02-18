import { create } from "../../library/index.ts";
import { Model } from "./types.ts";

export default create.model<Model>({
  username: null,
  followers: null,
});
