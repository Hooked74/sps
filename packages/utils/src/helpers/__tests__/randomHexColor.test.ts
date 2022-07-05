import { randomHexColor } from "../randomHexColor";

describe("utils/helpers/randomHexColor", () => {
  it("Должен соответствовать формату #[0-9a-f]{6}", () => {
    expectJest(/^#[0-9a-f]{6}$/.test(randomHexColor())).toBeTruthy();
  });
});
