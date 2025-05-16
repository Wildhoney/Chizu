import { Query } from "../../../types/index.ts";
import { useRouter } from "./index.ts";
import * as React from "react";
import * as ReactRouterDOM from "react-router-dom";

export type Props = { using: UseRouter; children(): React.ReactNode };

export type UseRouter = ReturnType<typeof useRouter>;

export type Context<Q extends null | Query> = {
  navigate: ReactRouterDOM.NavigateFunction;
  location: ReactRouterDOM.Location;
  params: Q extends NonNullable<Query>
    ? Readonly<ReactRouterDOM.Params<Q>>
    : null;
  search: [URLSearchParams, ReactRouterDOM.SetURLSearchParams];
};
