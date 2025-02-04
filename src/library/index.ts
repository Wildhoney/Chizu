import app from "./app/index.tsx";
import module from "./module/index.tsx";
import model from "./model/index.ts";
import view from "./view/index.ts";
import controller from "./controller/index.ts";

export { State, Lifecycle } from "./types/index.ts";
export const create = { app, module, model, view, controller };
