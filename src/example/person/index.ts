import { create } from "../../library/index.ts";
import controller from "./controller.ts";
import model from "./model.ts";
import view from "./view.tsx";

export default create.module({
  controller,
  model,
  view,
});
