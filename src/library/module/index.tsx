import { ComponentChildren } from "preact";
import { Actions, Model, Routes } from "../types/index.ts";
import { ModuleOptions } from "./types.ts";
import Tree from "./tree/index.tsx";
import { ElementName } from "./tree/types.ts";

export default function module<
  M extends Model,
  A extends Actions,
  R extends Routes,
>(name: TemplateStringsArray) {
  return (options: ModuleOptions<M, A, R>): ComponentChildren => {
    const elementName = name.join("") as ElementName;
    return <Tree moduleOptions={{ ...options, elementName }} />;
  };
}
