import { moveArrayItem } from "../moveArrayItem";

describe("utils/helpers/moveArrayItem", () => {
  it("Должен вернуть [Саша, Маша, Даша, Сергей, Игнат]", () => {
    const mockArray = ["Даша", "Саша", "Маша", "Сергей", "Игнат"];
    expectJest(moveArrayItem(mockArray, 0, 2)).toEqual(["Саша", "Маша", "Даша", "Сергей", "Игнат"]);
  });

  it("Должен вернуть [45, 842, 18, 33]", () => {
    const mockArray = [45, 33, 842, 18];
    expectJest(moveArrayItem(mockArray, 1, 4)).toEqual([45, 842, 18, 33]);
  });
});
