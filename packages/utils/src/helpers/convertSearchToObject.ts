export const convertSearchToObject = (search: string) =>
  Object.fromEntries(new URLSearchParams(search));
