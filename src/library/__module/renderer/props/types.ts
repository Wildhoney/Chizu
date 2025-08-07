import { ModuleDefinition } from "../../../types/index.ts";
import { UseOptions } from "../../types.ts";
import useProps from "./index.ts";

export type Props<M extends ModuleDefinition> = {
  options: UseOptions<M>;
};

export type UseProps = ReturnType<typeof useProps>;
