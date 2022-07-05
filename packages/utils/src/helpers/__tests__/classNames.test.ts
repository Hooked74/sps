import { classNames } from "../classNames";

describe("utils/helpers/classNames", () => {
  it("Должен вернуть строку, при передачи объекта с пустыми и булиановыми значениями", () => {
    expectJest(
      classNames({
        a: true,
        b: false,
        c: 0,
        d: null,
        e: undefined,
        f: 1,
      })
    ).toEqual("a f");
  });

  it("Должен проигнорировать все значения, приводящие к false", () => {
    expectJest(classNames("a", 0, null, undefined, 1, false, "b")).toEqual("a 1 b");
  });

  it("Должен поддерживать разного типа аргументы(объекты, строки и тд)", () => {
    expectJest(classNames({ a: true }, "b", 0)).toEqual("a b");
  });

  it("Должен убрать пустые аргументы", () => {
    expectJest(classNames("", "b", {}, "")).toEqual("b");
  });

  it("Возвращает пустую строку для пустой конфигурации", () => {
    expectJest(classNames({})).toEqual("");
  });

  it("Поддерживает массив названий классов", () => {
    expectJest(classNames(["a", "b"])).toEqual("a b");
  });

  it("Присоединяет аргументы массива к строчным аргументам", () => {
    expectJest(classNames(["a", "b"], "c")).toEqual("a b c");
    expectJest(classNames("c", ["a", "b"])).toEqual("c a b");
  });

  it("Обрабатывает несколько аргументов массива", () => {
    expectJest(classNames(["a", "b"], ["c", "d"])).toEqual("a b c d");
  });

  it("Обрабатывает массивы, которые включают в значения, приводящие к false", () => {
    expectJest(classNames(["a", 0, null, undefined, false, true, "b"])).toEqual("a b");
  });

  it("Обрабатывает массивы, которые включают вложенные массивы", () => {
    expectJest(classNames(["a", ["b", "c"]])).toEqual("a b c");
  });

  it("Обрабатывает массивы, которые включают объекты", () => {
    expectJest(classNames(["a", { b: true, c: false }])).toEqual("a b");
  });

  it("Jбрабатывает глубокую рекурсию", () => {
    expectJest(classNames(["a", ["b", ["c", { d: true }]]])).toEqual("a b c d");
  });

  it("Обрабатывает пустой массив", () => {
    expectJest(classNames("a", [])).toEqual("a");
  });

  it("Обрабатывает пустую глубокую вложенность", () => {
    expectJest(classNames("a", [[]])).toEqual("a");
  });

  it("handles all types of truthy and falsy property values as expectJested", function () {
    expectJest(
      classNames({
        // falsy:
        null: null,
        emptyString: "",
        noNumber: NaN,
        zero: 0,
        negativeZero: -0,
        false: false,
        undefined: undefined,

        // truthy (literally anything else):
        nonEmptyString: "foobar",
        whitespace: " ",
        function: Object.prototype.toString,
        emptyObject: {},
        nonEmptyObject: { a: 1, b: 2 },
        emptyList: [],
        nonEmptyList: [1, 2, 3],
        greaterZero: 1,
      })
    ).toEqual(
      "nonEmptyString whitespace function emptyObject nonEmptyObject emptyList nonEmptyList greaterZero"
    );
  });

  it("Обрабатывает метод toString(), определенный в объекте", () => {
    expectJest(
      classNames({
        toString: () => "classFromMethod",
      })
    ).toEqual("classFromMethod");
  });

  it("Обрабатывает метод toString() унаследованный от объекта", () => {
    class Class1 {
      toString() {
        return "classFromMethod";
      }
    }
    class Class2 extends Class1 {}

    expectJest(classNames(new Class2())).toEqual("classFromMethod");
  });
});
