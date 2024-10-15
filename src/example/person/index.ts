import { create } from "../../library/index.ts";
import controller from "./controller.ts";
import model from "./model.ts";
import view from "./view.tsx";
import { Model, Actions } from "./types.ts";

export default create.module<Model, Actions>({
  controller,
  model,
  view,
});
