import { convertSearchToObject } from "../convertSearchToObject";
import { expect } from "@jest/globals";

describe("utils/helpers/convertSearchToObject", () => {
  it("Должен вернуть объект из `?test=123`", () => {
    expect(convertSearchToObject("?test=123")).toEqual({ test: "123" });
  });

  it("Должен вернуть объект пустой объект", () => {
    expect(convertSearchToObject("")).toEqual({});
  });
});
