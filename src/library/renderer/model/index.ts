import * as React from "react";
import { Module } from "../../types/index.ts";
import { Props } from "./types.ts";

export default function useModel<M extends Module>(props: Props<M>) {
  return React.useRef<M["Model"]>(props.options.model);
}
