import { getParamFromPathname } from "../getParamFromPathname";
import { expect } from "@jest/globals";

describe("utils/helpers/getParamFromPathname", () => {
  const { location } = window;

  beforeAll(() => {
    delete window.location;

    // @ts-ignore
    window.location = new URL("https://live.mts.ru/perm/cinema");
  });

  afterAll(() => {
    window.location = location;
  });

  it("Должен вернуть { city: 'perm', categoryAlias: 'cinema' }", () => {
    expect(getParamFromPathname(":city/:categoryAlias")).toEqual({
      city: "perm",
      categoryAlias: "cinema",
    });
  });

  it("Должен вернуть undefined", () => {
    expect(getParamFromPathname(":id/qwe")).toBe(undefined);
  });
});
