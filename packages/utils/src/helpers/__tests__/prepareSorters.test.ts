import { SortOrders } from "../../constants";
import { prepareSorters } from "../prepareSorters";
import { expect } from "@jest/globals";

describe("utils/helpers/prepareSorters", () => {
  it("Должен вернуть [apple,asc, orange,desc]", () => {
    const mockObj = { apple: "asc", orange: "desc" } as Dictionary<SortOrders>;
    expect(prepareSorters(mockObj)).toEqual(["apple,asc", "orange,desc"]);
  });
});
