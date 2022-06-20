export const enumToArray = <T>(enumObject: T) => {
  const keys = [];

  for (let key in enumObject) {
    if (Number.isFinite(+key)) continue;
    keys.push(key);
  }

  return keys;
};
