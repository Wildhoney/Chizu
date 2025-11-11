import type { State } from "immeration";

export type Store = State<Record<string, unknown>> | null;
