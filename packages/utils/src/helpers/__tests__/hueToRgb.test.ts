import { hueToRgb } from "../hueToRgb";

describe("utils/helpers/hueToRgb", () => {
  it("Должен вернуть число", () => {
    expectJest(Number.isFinite(hueToRgb(1, 1, 2))).toBeTruthy();
  });
});
