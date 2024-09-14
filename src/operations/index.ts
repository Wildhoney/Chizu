import { Primitive } from "../types";

export function ƒ() {}

export const Operation = Symbol("Operation");

ƒ.is = <T extends Primitive>(a: T, b: T, c) => Operation;

// ƒ.not = (x: Primitive) => {};

// ƒ.gt = (x: Primitive) => {};

// ƒ.lt = (x: Primitive) => {};

ƒ.map = <T extends unknown>(xs: T[], x: (x: T) => {}) => Operation;
