import { Maybe, create } from "../../library/index.ts";
import { Model } from "./types.ts";

export default create.model<Model>({
  id: 1,
  task: null,
  tasks: Maybe.None(),
});
