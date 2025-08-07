
const key = "__type";

export type Action<T> = string & { [key]: T };