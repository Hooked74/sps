import { GenderTypes, PluralAccusativeCaseTypes } from "../constants";
import { LanguageСases, LanguageСasesOfOne } from "../types";

export const prepareLanguageСasesOfOne = (
  nominative: string,
  genitive: string,
  dative: string,
  accusative: string,
  ablative: string,
  prepositional: string
) => ({ nominative, genitive, dative, accusative, ablative, prepositional });

export const concatTwoLanguageСasesOfOne = (
  firstLanguageCases: LanguageСasesOfOne,
  secondLanguageCases: LanguageСasesOfOne
) => {
  let resultLanguageCases = {} as LanguageСasesOfOne;

  for (let key in firstLanguageCases) {
    let k = key as keyof LanguageСasesOfOne;
    resultLanguageCases[k] = `${firstLanguageCases[k]} ${secondLanguageCases[k]}`;
  }

  return resultLanguageCases;
};

export const prepareLanguageСases = (
  singular: LanguageСasesOfOne,
  plural: LanguageСasesOfOne,
  genderType: GenderTypes,
  pluralAccusativeCaseType: PluralAccusativeCaseTypes
) => ({
  singular,
  plural,
  genderType,
  pluralAccusativeCaseType,
});

export const composeLanguageCases = (
  languageCasesList: LanguageСases[],
  genderType: GenderTypes,
  pluralAccusativeCaseType: PluralAccusativeCaseTypes
) => {
  return {
    ...languageCasesList.reduce((acc, languageCases) => {
      acc.singular = concatTwoLanguageСasesOfOne(acc.singular, languageCases.singular);
      acc.plural = concatTwoLanguageСasesOfOne(acc.plural, languageCases.plural);

      return acc;
    }),
    genderType,
    pluralAccusativeCaseType,
  };
};
