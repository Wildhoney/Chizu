import { Draft } from "immer";
import { Primitive } from "utility-types";

export type FnType = (...args: any[]) => any;

export type RecordType = Record<string, unknown>;

export type Names<T> = {
  [K in keyof T]: T[K] extends FnType ? K : never;
}[keyof T];

export type ClassType = abstract new (...args: any) => any;

export type Dispatchables<T extends ClassType> = Names<InstanceType<T>>;

export type DraftFn<Model> = (draft: Draft<Model>) => void;

export type Tree = unknown;

export type Keys<Model> = {
  [K in keyof Model]: K;
}[keyof Model];

type PathsToStringProps<T> = T extends Primitive
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
    ? F
    : T extends [infer F, ...infer R]
      ? F extends string
        ? `${F}${D}${Join<Extract<R, string[]>, D>}`
        : never
      : string;

export type Props<Model extends RecordType> = Join<
  PathsToStringProps<Model>,
  "."
>;

export enum State {
  Pending,
  Optimistic,
  Errored,
}

export type Unify<T, U> = [T, U];
