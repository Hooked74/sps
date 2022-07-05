import { enumToArray } from "../enumToArray";

describe("utils/helpers/enumToArray", () => {
  it("Должен вернуть массив", () => {
    enum Mock {
      mock1,
      mock2,
    }

    expectJest(enumToArray(Mock)).toEqual(["mock1", "mock2"]);
  });
});
