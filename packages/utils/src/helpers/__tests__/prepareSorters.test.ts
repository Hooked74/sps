import { SortOrders } from "../../constants";
import { prepareSorters } from "../prepareSorters";

describe("utils/helpers/prepareSorters", () => {
  it("Должен вернуть [apple,asc, orange,desc]", () => {
    const mockObj = { apple: "asc", orange: "desc" } as Dictionary<SortOrders>;
    expectJest(prepareSorters(mockObj)).toEqual(["apple,asc", "orange,desc"]);
  });
});
