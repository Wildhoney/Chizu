import { Module } from "../types/index.ts";
import { ControllerDefinition } from "./types.ts";

export default function controller<M extends Module>(
  definition: ControllerDefinition<M>,
) {
  return definition;
}
