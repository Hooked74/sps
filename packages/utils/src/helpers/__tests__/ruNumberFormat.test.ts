import { ruNumberFormat } from "../ruNumberFormat";
import { expect } from "@jest/globals";

describe("utils/helpers/ruNumberFormat", () => {
  it("Должен вернуть число 12 343 423 213,112", () => {
    expect(ruNumberFormat("12343423213.1123")).toBe("12 343 423 213,112");
  });

  it("Должен вернуть не число", () => {
    expect(ruNumberFormat("abc")).toBe("не число");
  });
});
