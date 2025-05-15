import { Context, Props } from "./types.ts";
import * as React from "react";
import * as ReactRouterDOM from "react-router-dom";

export function useRouter() {
  const ref = React.useRef<Context>(null);

  return ref;
}

export function Router({ using }: Props): null | React.ReactElement {
  const isInRouter = ReactRouterDOM.useInRouterContext();
  return isInRouter ? <Setup using={using} /> : null;
}

export function Setup({ using }: Props): null {
  const navigate = ReactRouterDOM.useNavigate();
  const location = ReactRouterDOM.useLocation();
  const params = ReactRouterDOM.useParams();
  const searchParams = ReactRouterDOM.useSearchParams();

  using.current = {
    navigate,
    location,
    params,
    searchParams,
  };

  return null;
}
