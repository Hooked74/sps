import { AdvancedEffectHookOptions } from "../types";

export const DefaultAdvancedEffectOptions: AdvancedEffectHookOptions = {
  hookKey: "useEffect",
  once: false,
  didUpdate: false,
  unmountCallback: null,
};
