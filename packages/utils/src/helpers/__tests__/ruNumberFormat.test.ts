import { ruNumberFormat } from "../ruNumberFormat";

describe("utils/helpers/ruNumberFormat", () => {
  it("Должен вернуть число 12 343 423 213,112", () => {
    expectJest(ruNumberFormat("12343423213.1123")).toBe("12 343 423 213,112");
  });

  it("Должен вернуть не число", () => {
    expectJest(ruNumberFormat("abc")).toBe("не число");
  });
});
