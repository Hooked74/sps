import { enumToArray } from "../enumToArray";
import { expect } from "@jest/globals";

describe("utils/helpers/enumToArray", () => {
  it("Должен вернуть массив", () => {
    enum Mock {
      mock1,
      mock2,
    }

    expect(enumToArray(Mock)).toEqual(["mock1", "mock2"]);
  });
});
