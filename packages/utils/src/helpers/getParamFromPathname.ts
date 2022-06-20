import { match, MatchResult } from "path-to-regexp";
import { GlobalManager } from "./GlobalManager";

export const getParamFromPathname = <Params extends Dictionary<string>>(pathname: string) =>
  (
    match<Params>(pathname, {
      start: false,
      end: false,
    })(GlobalManager.get("location").pathname) as MatchResult<Params>
  )?.params;
