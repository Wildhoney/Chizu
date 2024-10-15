import { Model } from "../types/index.ts";

export default function model<M extends Model>(model: M): M {
  return model;
}
