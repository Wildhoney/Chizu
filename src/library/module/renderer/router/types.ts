import { useRouter } from "./index.ts";
import * as ReactRouterDOM from "react-router-dom";

export type Props = { using: UseRouter };

export type UseRouter = ReturnType<typeof useRouter>;

export type Context = {
  navigate: ReactRouterDOM.NavigateFunction;
  location: ReactRouterDOM.Location;
  params: Readonly<ReactRouterDOM.Params<string>>;
  searchParams: [URLSearchParams, ReactRouterDOM.SetURLSearchParams];
};
