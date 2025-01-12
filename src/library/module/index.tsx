import { ComponentChildren } from "preact";
import { Actions, Model, Parameters, Routes } from "../types/index.ts";
import { Module, ModuleOptions } from "./types.ts";
import Tree from "./tree/index.tsx";

export default function module<
  M extends Model,
  A extends Actions,
  R extends Routes,
  P extends Parameters,
>(name: TemplateStringsArray) {
  return (options: ModuleOptions<M, A, R>): Module => {
    const elementName = name.join("");

    return function render(): ComponentChildren {
      return <Tree<M, A, R, P> moduleOptions={{ ...options, elementName }} />;
    };
  };
}
