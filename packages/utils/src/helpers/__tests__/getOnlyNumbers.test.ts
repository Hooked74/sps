import { getOnlyNumbers } from "../getOnlyNumbers";

describe("utils/helpers/getOnlyNumbers", () => {
  it("Должен вернуть 22", () => {
    expectJest(getOnlyNumbers("R2D2")).toBe("22");
  });

  it("Должен вернуть 433", () => {
    expectJest(getOnlyNumbers("Дайте мне 4 батона, 33 яблока")).toBe("433");
  });
});
