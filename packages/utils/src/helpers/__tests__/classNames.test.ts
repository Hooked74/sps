import { classNames } from "../classNames";
import { expect } from "@jest/globals";

describe("utils/helpers/classNames", () => {
  it("Должен вернуть строку, при передачи объекта с пустыми и булиановыми значениями", () => {
    expect(
      classNames({
        a: true,
        b: false,
        c: 0,
        d: null,
        e: undefined,
        f: 1,
      })
    ).toEqual("a f d");
  });

  it("Должен проигнорировать все значения, приводящие к false", () => {
    expect(classNames("a", 0, null, undefined, 1, false, "b")).toEqual("a 1 b");
  });

  it("Должен поддерживать разного типа аргументы(объекты, строки и тд)", () => {
    expect(classNames({ a: true }, "b", 0)).toEqual("a b");
  });

  it("Должен убрать пустые аргументы", () => {
    expect(classNames("", "b", {}, "")).toEqual("b");
  });

  it("Возвращает пустую строку для пустой конфигурации", () => {
    expect(classNames({})).toEqual("");
  });

  it("Поддерживает массив названий классов", () => {
    expect(classNames(["a", "b"])).toEqual("a b");
  });

  it("Присоединяет аргументы массива к строчным аргументам", () => {
    expect(classNames(["a", "b"], "c")).toEqual("a b c");
    expect(classNames("c", ["a", "b"])).toEqual("c a b");
  });

  it("Обрабатывает несколько аргументов массива", () => {
    expect(classNames(["a", "b"], ["c", "d"])).toEqual("a b c d");
  });

  it("Обрабатывает массивы, которые включают в значения, приводящие к false", () => {
    expect(classNames(["a", 0, null, undefined, false, true, "b"])).toEqual("a b");
  });

  it("Обрабатывает массивы, которые включают вложенные массивы", () => {
    expect(classNames(["a", ["b", "c"]])).toEqual("a b c");
  });

  it("Обрабатывает массивы, которые включают объекты", () => {
    expect(classNames(["a", { b: true, c: false }])).toEqual("a b");
  });

  it("Jбрабатывает глубокую рекурсию", () => {
    expect(classNames(["a", ["b", ["c", { d: true }]]])).toEqual("a b c d");
  });

  it("Обрабатывает пустой массив", () => {
    expect(classNames("a", [])).toEqual("a");
  });

  it("Обрабатывает пустую глубокую вложенность", () => {
    expect(classNames("a", [[]])).toEqual("a");
  });

  it("handles all types of truthy and falsy property values as expected", function () {
    expect(
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
    expect(
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

    expect(classNames(new Class2())).toEqual("classFromMethod");
  });
});
