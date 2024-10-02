import { Patch } from "immer";

const events = new Map();

export function register(name, listener) {
  events.set(name, listener);
}

export function dispatch(patch: Patch) {
  events.get(patch.path.join("."))(patch);
}
