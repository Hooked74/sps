import { GlobalManager } from "@h74-sps/utils";

export const STORE_EFFECT_HOOK_KEY = GlobalManager.isClient() ? "useLayoutEffect" : "useEffect";
