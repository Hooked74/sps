import { formatBytes } from "../formatBytes";
import { expect } from "@jest/globals";

describe("utils/helpers/formatBytes", () => {
  it("Должен вернуть 0", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("Должен вернуть получить значение в GB", async () => {
    expect(formatBytes(10 * 1024 ** 3)).toBe("10 GB");
  });

  it("Должен округлить до 3х знаков", async () => {
    expect(parseFloat(formatBytes(123456789, 3)).toString().split(".")[1].length).toBe(3);
  });
});
