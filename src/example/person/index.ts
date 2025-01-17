import { create } from "../../library/index.ts";
import controller from "./controller.ts";
import model from "./model.ts";
import view from "./view.tsx";
import { Model, Actions } from "./types.ts";
import { Routes } from "../types.ts";
import { Parameters } from "../../library/types/index.ts";

export default create.module<Model, Actions, Routes, Parameters>`x-person`({
  controller,
  model,
  view,
});
