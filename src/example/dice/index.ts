import { create } from "../../library/index.ts";
import controller from "./controller.ts";
import model from "./model.ts";
import view from "./view.tsx";
import { Model, Actions, Props } from "./types.ts";
import { Routes } from "../types.ts";

export default create.module<Model, Actions, Routes, Props>`x-another`({
  controller,
  model,
  view,
});
