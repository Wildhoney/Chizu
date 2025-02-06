import { Stitch } from "../../library/types/index.ts";
import { Route, Routes } from "../types.ts";

export type Model = {
  kite: number;
};

export const enum Events {
  Roll,
}

export type Actions = [Events.Roll];

export type Props = {
  initialKite: string;
  taskCount: string;
};

export type Module = Stitch<Model, Actions, Props, [Routes, Route.Dashboard]>;
