import { randomHexColor } from "../randomHexColor";
import { expect } from "@jest/globals";

describe("utils/helpers/randomHexColor", () => {
  it("Должен соответствовать формату #[0-9a-f]{6}", () => {
    expect(/^#[0-9a-f]{6}$/.test(randomHexColor())).toBeTruthy();
  });
});
