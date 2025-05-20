import app from "./app/index.tsx";
import { ControllerDefinition } from "./controller/types.ts";
import module from "./module/index.tsx";
import { ViewArgs, ViewDefinition } from "./view/types.ts";

export { Lifecycle, State } from "./types/index.ts";
export * as utils from "./utils/index.ts";
export const create = { app, module };
export { EventError } from "./module/renderer/dispatchers/utils.ts";
export type * as Create from "./types/index.ts";

export type { Pk } from "./types/index.ts";

export type { ViewDefinition as View };
export type { ViewArgs as Within };
export type { ControllerDefinition as Controller };
