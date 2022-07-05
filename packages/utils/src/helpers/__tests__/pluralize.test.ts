import { prepareLanguageСases, prepareLanguageСasesOfOne } from "..";
import { GenderTypes, PluralAccusativeCaseTypes } from "../../constants";
import { pluralize, pluralizeFromLanguageCases } from "../pluralize";

describe("utils/helpers/pluralize", () => {
  const mockArray = ["Автомобиль", "Автомобиля", "Автомобилей"];

  describe("pluralize", () => {
    it("Должен вернуть Автомобиль", () => {
      expectJest(pluralize(1, mockArray)).toBe("Автомобиль");
    });

    it("Должен вернуть Автомобиля", () => {
      expectJest(pluralize(2, mockArray)).toBe("Автомобиля");
    });

    it("Должен вернуть Автомобилей", () => {
      expectJest(pluralize(5, mockArray)).toBe("Автомобилей");
    });

    it("Должен вернуть Автомобилей", () => {
      expectJest(pluralize(100, mockArray)).toBe("Автомобилей");
    });

    it("Должен вернуть Автомобилей", () => {
      expectJest(pluralize(1000, mockArray)).toBe("Автомобилей");
    });
  });

  describe("pluralizeFromLanguageCases", () => {
    const mockSingularArray = [
      "автомобиль",
      "автомобиля",
      "автомобилю",
      "автомобиль",
      "автомобилем",
      "автомобиле",
    ];
    const mockPluralArray = [
      "автомобили",
      "автомобилей",
      "автомобилям",
      "автомобили",
      "автомобилями",
      "автомобилях",
    ];
    const mockLanguageCases = prepareLanguageСases(
      prepareLanguageСasesOfOne(
        ...(mockSingularArray as Parameters<typeof prepareLanguageСasesOfOne>)
      ),
      prepareLanguageСasesOfOne(
        ...(mockPluralArray as Parameters<typeof prepareLanguageСasesOfOne>)
      ),
      GenderTypes.MASCULINE,
      PluralAccusativeCaseTypes.WHICH
    );

    it("Должен вернуть автомобиля", () => {
      expectJest(pluralizeFromLanguageCases(3, mockLanguageCases)).toBe(
        mockLanguageCases.singular.genitive
      );
    });

    it("Должен вернуть автомобиль", () => {
      expectJest(pluralizeFromLanguageCases(1, mockLanguageCases)).toBe(
        mockLanguageCases.singular.nominative
      );
    });
    it("Должен вернуть автомобили", () => {
      expectJest(pluralizeFromLanguageCases(5, mockLanguageCases)).toBe(
        mockLanguageCases.plural.genitive
      );
    });
  });
});
