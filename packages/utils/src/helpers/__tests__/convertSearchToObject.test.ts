import { convertSearchToObject } from "../convertSearchToObject";

describe("utils/helpers/convertSearchToObject", () => {
  it("Должен вернуть объект из `?test=123`", () => {
    expectJest(convertSearchToObject("?test=123")).toEqual({ test: "123" });
  });

  it("Должен вернуть объект пустой объект", () => {
    expectJest(convertSearchToObject("")).toEqual({});
  });
});
