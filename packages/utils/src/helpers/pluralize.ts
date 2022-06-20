import { LanguageСases } from "../types";

export const pluralize = (n: int, titles: string[]) => {
  return titles[
    n % 10 === 1 && n % 100 !== 11
      ? 0
      : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
      ? 1
      : 2
  ];
};

export const pluralizeFromLanguageCases = (n: int, languageCases: LanguageСases) =>
  pluralize(n, [
    languageCases.singular.nominative,
    languageCases.singular.genitive,
    languageCases.plural.genitive,
  ]);
