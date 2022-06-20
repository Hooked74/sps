import { hslToRgb } from "../hslToRgb";
import { rgbToHsl } from "../rgbToHsl";
import { expect } from "@jest/globals";

describe("utils/helpers/hslToRgb", () => {
  it("Должен вернуть rgb(массив из 3х чисел)", () => {
    const rgb = hslToRgb(200, 30, 50);

    expect(Array.isArray(rgb)).toBeTruthy();
    expect(Number.isFinite(rgb[0])).toBeTruthy();
    expect(Number.isFinite(rgb[1])).toBeTruthy();
    expect(Number.isFinite(rgb[2])).toBeTruthy();
    expect((rgb as any)[3]).toBeUndefined();
  });

  it("Конвертация из hls в rgb и обратно. Должен получиться одинаковый результат", () => {
    const hslByDefault = [200, 80, 50] as const;
    const rgb = hslToRgb(...hslByDefault);
    const hsl = rgbToHsl(...rgb);

    expect(hslByDefault).toEqual(hsl);
  });
});
