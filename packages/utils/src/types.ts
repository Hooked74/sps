import { SortOrders } from "./constants";
import { prepareLanguageСases, prepareLanguageСasesOfOne } from "./helpers";

export type Sorters = Dictionary<SortOrders>;
export type SortString<T extends string> = `${T},${SortOrders}`;

export type LanguageСasesOfOne = ReturnType<typeof prepareLanguageСasesOfOne>;
export type LanguageСases = ReturnType<typeof prepareLanguageСases>;

export type ClassNamesProperty = float | string | boolean | Object | ClassNamesProperty[];

export interface AdvancedEffectHookOptions {
  hookKey?: "useEffect" | "useLayoutEffect";
  once?: boolean;
  didUpdate?: boolean;
  unmountCallback?: Handler;
}

export interface BaseResponse<Data = any> {
  data: Data;
  headers: Dictionary<string>;
}
