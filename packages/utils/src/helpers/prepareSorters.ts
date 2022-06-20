import { Sorters, SortString } from "../types";

export const prepareSorters = <T extends string>(sorters: Sorters) => {
  const sort = [] as SortString<T>[];

  for (const [key, value] of Object.entries(sorters)) {
    const sortItem = `${key},${value}` as SortString<T>;
    sort.push(sortItem);
  }

  return sort;
};
