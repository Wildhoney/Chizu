import render from "preact-render-to-string";
import { Actions, Model, Options } from "../types/index.ts";
import { Module } from "../module/index.ts";

export default function app(options: Options) {
  function register(module: any): void {}

  function serve(module: Module<Model, Actions>): void {
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
