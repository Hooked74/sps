import validation from "../../main";
import { expect } from "@jest/globals";

describe("validation/extensions/semver", () => {
  it("Должна пройти проверку валидная версия", () => {
    validation.attempt("2.1.0", validation.semver());
  });

  it("Версия не может содержать буквы", () => {
    expect(() => validation.attempt("a2.1.0", validation.semver())).toThrowError();
    expect(() => validation.attempt("2.1.a", validation.semver())).toThrowError();
  });

  it("Формат версионирования должен быть мажор.минор.патч", () => {
    expect(() => validation.attempt("2.1.", validation.semver())).toThrowError();
    expect(() => validation.attempt("2..1", validation.semver())).toThrowError();
    expect(() => validation.attempt("2.1", validation.semver())).toThrowError();
    expect(() => validation.attempt(".1", validation.semver())).toThrowError();
    expect(() => validation.attempt("1", validation.semver())).toThrowError();
  });

  it('Должны отработать проверки на сравнение "больше"', () => {
    validation.attempt("2.3.0", validation.semver().gt("2.2.2"));
    expect(() => validation.attempt("2.2.2", validation.semver().gt("2.2.2"))).toThrowError();
    expect(() => validation.attempt("2.2.0", validation.semver().gt("2.2.2"))).toThrowError();
  });

  it('Должны отработать проверки на сравнение "больше либо равно"', () => {
    validation.attempt("2.3.0", validation.semver().gte("2.2.2"));
    validation.attempt("2.2.2", validation.semver().gte("2.2.2"));
    expect(() => validation.attempt("2.2.0", validation.semver().gte("2.2.2"))).toThrowError();
  });

  it('Должны отработать проверки на сравнение "меньше"', () => {
    validation.attempt("2.1.0", validation.semver().lt("2.2.2"));
    expect(() => validation.attempt("2.2.2", validation.semver().lt("2.2.2"))).toThrowError();
    expect(() => validation.attempt("2.3.0", validation.semver().lt("2.2.2"))).toThrowError();
  });

  it('Должны отработать проверки на сравнение "меньше либо равно"', () => {
    validation.attempt("2.1.0", validation.semver().lte("2.2.2"));
    validation.attempt("2.2.2", validation.semver().lte("2.2.2"));
    expect(() => validation.attempt("2.3.0", validation.semver().lte("2.2.2"))).toThrowError();
  });

  it('Должны отработать проверки на сравнение "равно"', () => {
    validation.attempt("2.2.2", validation.semver().eq("2.2.2"));
    expect(() => validation.attempt("2.3.2", validation.semver().eq("2.2.2"))).toThrowError();
  });

  it('Должны отработать проверки на сравнение "не равно"', () => {
    validation.attempt("2.3.2", validation.semver().neq("2.2.2"));
    expect(() => validation.attempt("2.2.2", validation.semver().neq("2.2.2"))).toThrowError();
  });

  describe("Должны отработать проверки на кастомные сравнения", () => {
    it('Должны отработать проверки на сравнение "не равно"', () => {
      validation.attempt("2.3.2", validation.semver().cmp("!=", "2.2.2"));
      expect(() =>
        validation.attempt("2.2.2", validation.semver().cmp("!=", "2.2.2"))
      ).toThrowError();

      validation.attempt("2.3.2", validation.semver().cmp("!==", "2.2.2"));
      expect(() =>
        validation.attempt("2.2.2", validation.semver().cmp("!==", "2.2.2"))
      ).toThrowError();
    });

    it('Должны отработать проверки на сравнение "меньше"', () => {
      validation.attempt("2.1.2", validation.semver().cmp("<", "2.2.2"));
      expect(() =>
        validation.attempt("2.2.2", validation.semver().cmp("<", "2.2.2"))
      ).toThrowError();
      expect(() =>
        validation.attempt("2.3.2", validation.semver().cmp("<", "2.2.2"))
      ).toThrowError();
    });

    it('Должны отработать проверки на сравнение "меньше либо равно"', () => {
      validation.attempt("2.1.2", validation.semver().cmp("<=", "2.2.2"));
      validation.attempt("2.2.2", validation.semver().cmp("<=", "2.2.2"));
      expect(() =>
        validation.attempt("2.3.2", validation.semver().cmp("<=", "2.2.2"))
      ).toThrowError();
    });

    it('Должны отработать проверки на сравнение "больше"', () => {
      validation.attempt("2.3.2", validation.semver().cmp(">", "2.2.2"));
      expect(() =>
        validation.attempt("2.2.2", validation.semver().cmp(">", "2.2.2"))
      ).toThrowError();
      expect(() =>
        validation.attempt("2.1.2", validation.semver().cmp(">", "2.2.2"))
      ).toThrowError();
    });

    it('Должны отработать проверки на сравнение "больше либо равно"', () => {
      validation.attempt("2.3.2", validation.semver().cmp(">=", "2.2.2"));
      validation.attempt("2.2.2", validation.semver().cmp(">=", "2.2.2"));
      expect(() =>
        validation.attempt("2.1.2", validation.semver().cmp(">=", "2.2.2"))
      ).toThrowError();
    });

    it('Должны отработать проверки на сравнение "равно"', () => {
      validation.attempt("2.2.2", validation.semver().cmp("=", "2.2.2"));
      expect(() =>
        validation.attempt("2.1.2", validation.semver().cmp("=", "2.2.2"))
      ).toThrowError();

      validation.attempt("2.2.2", validation.semver().cmp("==", "2.2.2"));
      expect(() =>
        validation.attempt("2.1.2", validation.semver().cmp("==", "2.2.2"))
      ).toThrowError();

      validation.attempt("2.2.2", validation.semver().cmp("===", "2.2.2"));
      expect(() =>
        validation.attempt("2.1.2", validation.semver().cmp("===", "2.2.2"))
      ).toThrowError();
    });
  });

  it("Должна отработать проверка на не соответствие версии диапазону", () => {
    validation.attempt("2.2.0", validation.semver().outside("<2.1.7", ">"));
    expect(() =>
      validation.attempt("1.2.8", validation.semver().outside(">=1.2.7 <1.3.0", ">"))
    ).toThrowError();

    validation.attempt("0.2.0", validation.semver().outside("1.*.0", "<"));
    expect(() =>
      validation.attempt("2.2.0", validation.semver().outside(">2.1.0", "<"))
    ).toThrowError();
  });

  it("Должна отработать проверка на соответствие версии диапазону", () => {
    validation.attempt("1.2.0", validation.semver().satisfies("1.*.0"));
    expect(() =>
      validation.attempt("1.2.0", validation.semver().satisfies(">=1.3.0"))
    ).toThrowError();
  });

  it("Должна отработать проверка, что версия выше диапазона", () => {
    validation.attempt("2.2.0", validation.semver().gtr("1.*.0"));
    expect(() => validation.attempt("1.2.0", validation.semver().gtr(">=1.3.0"))).toThrowError();
    expect(() => validation.attempt("1.3.0", validation.semver().gtr(">=1.3.0"))).toThrowError();
  });

  it("Должна отработать проверка, что версия ниже диапазона", () => {
    validation.attempt("0.2.0", validation.semver().ltr("1.*.0"));
    expect(() => validation.attempt("1.3.0", validation.semver().ltr(">=1.3.0"))).toThrowError();
    expect(() => validation.attempt("1.4.0", validation.semver().ltr(">=1.3.0"))).toThrowError();
  });

  it("Должна отработать проверка, что версия является диапазоном", () => {
    validation.attempt("2.1.0 - 4", validation.semverRange());
  });
});
