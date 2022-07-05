import { formatBytes } from "../formatBytes";

describe("utils/helpers/formatBytes", () => {
  it("Должен вернуть 0", () => {
    expectJest(formatBytes(0)).toBe("0 B");
  });

  it("Должен вернуть получить значение в GB", async () => {
    expectJest(formatBytes(10 * 1024 ** 3)).toBe("10 GB");
  });

  it("Должен округлить до 3х знаков", async () => {
    expectJest(parseFloat(formatBytes(123456789, 3)).toString().split(".")[1].length).toBe(3);
  });
});
