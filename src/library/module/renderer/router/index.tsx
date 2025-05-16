import { Query } from "../../../types/index.ts";
import { Context, Props } from "./types.ts";
import * as React from "react";
import * as ReactRouterDOM from "react-router-dom";

export function useRouter() {
  return React.useRef<Partial<Context<Query>>>(null);
}

export function Router({ using, children }: Props): React.ReactNode {
  const isInRouter = ReactRouterDOM.useInRouterContext();
  return isInRouter ? <Setup using={using}>{children}</Setup> : children();
}

export function Setup({ using, children }: Props): React.ReactNode {
  using.current = {
    navigate: ReactRouterDOM.useNavigate(),
    location: ReactRouterDOM.useLocation(),
    params: ReactRouterDOM.useParams(),
    search: ReactRouterDOM.useSearchParams(),
  };

  return <>{children()}</>;
}
