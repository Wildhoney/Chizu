import { create } from "../../library/index.ts";
import controller from "./controller.ts";
import model from "./model.ts";
import view from "./view.tsx";
import { Module } from "./types.ts";

export default create.module<Module>`x-dice`({
  controller,
  model,
  view,
});
