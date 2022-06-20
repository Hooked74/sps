import { getOnlyNumbers } from "../getOnlyNumbers";
import { expect } from "@jest/globals";

describe("utils/helpers/getOnlyNumbers", () => {
  it("Должен вернуть 22", () => {
    expect(getOnlyNumbers("R2D2")).toBe("22");
  });

  it("Должен вернуть 433", () => {
    expect(getOnlyNumbers("Дайте мне 4 батона, 33 яблока")).toBe("433");
  });
});
