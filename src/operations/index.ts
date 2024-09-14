import { Primitive } from "../types";

export function ƒ() {}

ƒ.is = <T extends Primitive>(a: T, b: T, c) => {};

// ƒ.not = (x: Primitive) => {};

// ƒ.gt = (x: Primitive) => {};

// ƒ.lt = (x: Primitive) => {};

ƒ.map = <T extends unknown>(xs: T[], x: (x: T) => {}) => {};
