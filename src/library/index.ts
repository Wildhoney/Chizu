import app from "./app/index.tsx";
import controller from "./controller/index.ts";
import model from "./model/index.ts";
import module from "./module/index.tsx";
import view from "./view/index.ts";

export { Lifecycle, Operation } from "./types/index.ts";
export * as utils from "./utils/index.ts";
export const create = { app, module, model, view, controller };
export { EventError } from "./module/renderer/dispatchers/utils.ts";
export type * as Create from "./types/index.ts";

export type { ViewArgs as Args } from "./view/types.ts";
export type { Pk } from "./types/index.ts";
