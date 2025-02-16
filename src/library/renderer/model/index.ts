import { Module } from "../../types/index.ts";
import { Props } from "./types.ts";
import * as React from "react";

export default function useModel<M extends Module>(props: Props<M>) {
  return React.useRef<M["Model"]>(props.options.model);
}
