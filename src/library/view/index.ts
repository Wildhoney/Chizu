import { Module } from "../types/index.ts";
import { ViewDefinition } from "./types.ts";

export default function view<M extends Module>(definition: ViewDefinition<M>) {
  return definition;
}
