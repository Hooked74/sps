export const moveArrayItem = (array: any[], from: int, to: int) => {
  const arrayCopy = [...array];
  arrayCopy.splice(to, 0, arrayCopy.splice(from, 1)[0]);

  return arrayCopy;
};
