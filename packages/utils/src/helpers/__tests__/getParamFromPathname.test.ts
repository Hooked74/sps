import { getParamFromPathname } from "../getParamFromPathname";

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
    expectJest(getParamFromPathname(":city/:categoryAlias")).toEqual({
      city: "perm",
      categoryAlias: "cinema",
    });
  });

  it("Должен вернуть undefined", () => {
    expectJest(getParamFromPathname(":id/qwe")).toBe(undefined);
  });
});
