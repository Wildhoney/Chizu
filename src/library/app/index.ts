import render from "preact-render-to-string";
import { Actions, Model, Routes } from "../types/index.ts";
import { Module } from "../module/index.ts";
import { AppOptions } from "./types.ts";

export default function app<
  M extends Model,
  A extends Actions,
  R extends Routes,
>(options: AppOptions<M, A, R>) {
  function register(module: any): void {}

  function serve(module: Module<Model, Actions, R>): void {
    Deno.serve((request) => {
      const body = render(module.meta.view({}));

      return new Response(body, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      });
    });
  }

  return { register, serve };
}
