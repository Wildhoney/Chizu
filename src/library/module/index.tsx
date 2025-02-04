import { Actions, Model, Routes } from "../types/index.ts";
import { ModuleOptions } from "./types.ts";
import Tree from "./tree/index.tsx";
import { ElementName } from "./tree/types.ts";
import { ElementType } from "preact/compat";

export default function module<
  M extends Model,
  A extends Actions,
  R extends Routes,
>(name: TemplateStringsArray) {
  return (options: ModuleOptions<M, A, R>): ElementType => {
    const elementName = name.join("") as ElementName;
    return () => <Tree moduleOptions={{ ...options, elementName }} />;
  };
}
