import app from "./app/index.tsx";
import controller from "./controller/index.ts";
import model from "./model/index.ts";
import module from "./module/index.tsx";
import view from "./view/index.ts";

export { State, Lifecycle } from "./types/index.ts";
export const create = { app, module, model, view, controller };
