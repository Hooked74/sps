import { hueToRgb } from "../hueToRgb";
import { expect } from "@jest/globals";

describe("utils/helpers/hueToRgb", () => {
  it("Должен вернуть число", () => {
    expect(Number.isFinite(hueToRgb(1, 1, 2))).toBeTruthy();
  });
});
