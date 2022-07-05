import { GenderTypes, PluralAccusativeCaseTypes } from "../../constants";
import {
  prepareLanguageСasesOfOne,
  prepareLanguageСases,
  concatTwoLanguageСasesOfOne,
  composeLanguageCases,
} from "../prepareLanguageСases";

const mockSingleArray = ["картошка", "картошки", "картошке", "картошку", "картошкой", "картошке"];
const mockPluralArray = mockSingleArray;

describe("utils/helpers/prepareLanguageСases", () => {
  it("Должен вернуть объект с падежами", () => {
    const [nominative, genitive, dative, accusative, ablative, prepositional] = mockSingleArray;

    expectJest(
      prepareLanguageСasesOfOne(
        ...(mockSingleArray as Parameters<typeof prepareLanguageСasesOfOne>)
      )
    ).toEqual({ nominative, genitive, dative, accusative, ablative, prepositional });
  });

  it("Должен вернуть расширенный объект с падежами", () => {
    const [nominative, genitive, dative, accusative, ablative, prepositional] = mockSingleArray;

    expectJest(
      prepareLanguageСases(
        prepareLanguageСasesOfOne(
          ...(mockSingleArray as Parameters<typeof prepareLanguageСasesOfOne>)
        ),
        prepareLanguageСasesOfOne(
          ...(mockPluralArray as Parameters<typeof prepareLanguageСasesOfOne>)
        ),
        GenderTypes.FEMININE,
        PluralAccusativeCaseTypes.WHICH
      )
    ).toEqual({
      singular: { nominative, genitive, dative, accusative, ablative, prepositional },
      plural: { nominative, genitive, dative, accusative, ablative, prepositional },
      genderType: GenderTypes.FEMININE,
      pluralAccusativeCaseType: PluralAccusativeCaseTypes.WHICH,
    });
  });

  it("Должен вернуть должен соединить два объекта с падежами", () => {
    const [nominative, genitive, dative, accusative, ablative, prepositional] = mockSingleArray;

    expectJest(
      concatTwoLanguageСasesOfOne(
        prepareLanguageСasesOfOne(
          ...(mockSingleArray as Parameters<typeof prepareLanguageСasesOfOne>)
        ),
        prepareLanguageСasesOfOne(
          ...(mockPluralArray as Parameters<typeof prepareLanguageСasesOfOne>)
        )
      )
    ).toEqual({
      nominative: `${nominative} ${nominative}`,
      genitive: `${genitive} ${genitive}`,
      dative: `${dative} ${dative}`,
      accusative: `${accusative} ${accusative}`,
      ablative: `${ablative} ${ablative}`,
      prepositional: `${prepositional} ${prepositional}`,
    });
  });

  it("Должен вернуть должен соединить два объекта с падежами", () => {
    const [nominative, genitive, dative, accusative, ablative, prepositional] = mockSingleArray;

    expectJest(
      concatTwoLanguageСasesOfOne(
        prepareLanguageСasesOfOne(
          ...(mockSingleArray as Parameters<typeof prepareLanguageСasesOfOne>)
        ),
        prepareLanguageСasesOfOne(
          ...(mockPluralArray as Parameters<typeof prepareLanguageСasesOfOne>)
        )
      )
    ).toEqual({
      nominative: `${nominative} ${nominative}`,
      genitive: `${genitive} ${genitive}`,
      dative: `${dative} ${dative}`,
      accusative: `${accusative} ${accusative}`,
      ablative: `${ablative} ${ablative}`,
      prepositional: `${prepositional} ${prepositional}`,
    });
  });

  it("Должен вернуть должен соединить два расширенных объекта с падежами", () => {
    const [nominative, genitive, dative, accusative, ablative, prepositional] = mockSingleArray;

    expectJest(
      composeLanguageCases(
        [
          prepareLanguageСases(
            prepareLanguageСasesOfOne(
              ...(mockSingleArray as Parameters<typeof prepareLanguageСasesOfOne>)
            ),
            prepareLanguageСasesOfOne(
              ...(mockPluralArray as Parameters<typeof prepareLanguageСasesOfOne>)
            ),
            GenderTypes.FEMININE,
            PluralAccusativeCaseTypes.WHICH
          ),
          prepareLanguageСases(
            prepareLanguageСasesOfOne(
              ...(mockSingleArray as Parameters<typeof prepareLanguageСasesOfOne>)
            ),
            prepareLanguageСasesOfOne(
              ...(mockPluralArray as Parameters<typeof prepareLanguageСasesOfOne>)
            ),
            GenderTypes.FEMININE,
            PluralAccusativeCaseTypes.WHICH
          ),
        ],
        GenderTypes.FEMININE,
        PluralAccusativeCaseTypes.WHICH
      )
    ).toEqual({
      singular: {
        nominative: `${nominative} ${nominative}`,
        genitive: `${genitive} ${genitive}`,
        dative: `${dative} ${dative}`,
        accusative: `${accusative} ${accusative}`,
        ablative: `${ablative} ${ablative}`,
        prepositional: `${prepositional} ${prepositional}`,
      },
      plural: {
        nominative: `${nominative} ${nominative}`,
        genitive: `${genitive} ${genitive}`,
        dative: `${dative} ${dative}`,
        accusative: `${accusative} ${accusative}`,
        ablative: `${ablative} ${ablative}`,
        prepositional: `${prepositional} ${prepositional}`,
      },
      genderType: GenderTypes.FEMININE,
      pluralAccusativeCaseType: PluralAccusativeCaseTypes.WHICH,
    });
  });
});
