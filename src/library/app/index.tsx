import { Routes } from "../types/index.ts";
import { AppOptions } from "./types.ts";
import { closest } from "./utils.ts";
import * as preact from "preact";

export default function app<R extends Routes = any>(
  options: AppOptions<R>,
): void {
  const Module = closest<R>(options);

  if (Module) preact.render(<Module />, document.body);
}
