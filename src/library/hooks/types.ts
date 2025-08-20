import { Annotation } from "../annotate/utils.ts";

export type Store = Record<string, undefined | Annotation<unknown>>;
