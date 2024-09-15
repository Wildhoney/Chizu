import { Property } from "../model";
import { Fn, Primitive } from "../types";

export function ƒ() {}

ƒ.is = <T extends Primitive>(a: Property<T>, b: T, c: Fn<T, unknown>) => {
  return a.get() === b ? c : null;
};

// ƒ.not = (x: Primitive) => {};

// ƒ.gt = (x: Primitive) => {};

// ƒ.lt = (x: Primitive) => {};

ƒ.map = <T extends unknown>(xs: T[], x: (x: T) => {}) => {};
