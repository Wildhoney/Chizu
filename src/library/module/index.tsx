import { ComponentChildren, JSX } from "preact";
import { Actions, Model, Parameters, Routes } from "../types/index.ts";
import { ModuleOptions } from "./types.ts";
import Tree from "./tree/index.tsx";

export default function module<
  M extends Model,
  A extends Actions,
  R extends Routes,
  P extends Parameters,
>(name: TemplateStringsArray) {
  return (options: ModuleOptions<M, A, R>): ComponentChildren => {
    const elementName = name.join("") as keyof JSX.IntrinsicElements;
    return <Tree<M, A, R, P> moduleOptions={{ ...options, elementName }} />;
  };
}
