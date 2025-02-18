import { Create } from "../../library/index.ts";
import { DistributedActions, Route, Routes } from "../types.ts";

export type Model = {
  username: null | string;
  followers: null | number;
};

export const enum Events {
  Profile,
}

export type Actions = DistributedActions | [Events.Profile];

type Props = {};

export type Module = Create.ModuleOptions<Model, Actions, Props, [Routes, Route.Dashboard]>;
