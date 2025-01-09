import { ComponentChildren } from "preact";
import { Actions, Model, Routes } from "../types/index.ts";
import { Module, ModuleOptions } from "./types.ts";
import Tree from "./tree/index.tsx";

export default function module<
  M extends Model,
  A extends Actions,
  R extends Routes,
>(name: TemplateStringsArray) {
  return (options: ModuleOptions<M, A, R>): Module => {
    const elementName = name.join("");

    return function render(): ComponentChildren {
      return <Tree<M, A, R> moduleOptions={{ ...options, elementName }} />;
    };
  };
}
