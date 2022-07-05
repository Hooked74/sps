import { EnvManager } from "../EnvManager";

describe("utils/helpers/EnvManager", () => {
  it("Должен вернуть env", () => {
    expectJest(EnvManager.env).toStrictEqual(process.env);
  });

  it("Должен вернуть значение NODE_ENV", () => {
    expectJest(EnvManager.get("NODE_ENV")).toBe("test");
  });

  it("Должен вернуть значение по умолчанию", () => {
    const defaultValue = fakerStatic.datatype.number();
    expectJest(EnvManager.get<any>("VITE_SOME_KEY", defaultValue)).toBe(defaultValue);
  });

  it("Должен сравнить значение NODE_ENV с равным ему", () => {
    expectJest(EnvManager.compare("NODE_ENV", "test")).toBeTruthy();
  });

  it("Должен сравнить значение NODE_ENV с отличным от него", () => {
    expectJest(EnvManager.compare("NODE_ENV", "development")).toBeFalsy();
  });

  it("Должен распарсить строковые типы NODE_NO_WARNINGS и VITE_STORAGE_DEVTOOLS_ENABLE", () => {
    expectJest(EnvManager.get("NODE_NO_WARNINGS")).toStrictEqual(expect.any(Number));
    expectJest(EnvManager.get("VITE_STORAGE_DEVTOOLS_ENABLE")).toStrictEqual(expect.any(Boolean));
  });
});
