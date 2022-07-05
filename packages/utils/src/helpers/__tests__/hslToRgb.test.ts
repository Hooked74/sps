import { hslToRgb } from "../hslToRgb";
import { rgbToHsl } from "../rgbToHsl";

describe("utils/helpers/hslToRgb", () => {
  it("Должен вернуть rgb(массив из 3х чисел)", () => {
    const rgb = hslToRgb(200, 30, 50);

    expectJest(Array.isArray(rgb)).toBeTruthy();
    expectJest(Number.isFinite(rgb[0])).toBeTruthy();
    expectJest(Number.isFinite(rgb[1])).toBeTruthy();
    expectJest(Number.isFinite(rgb[2])).toBeTruthy();
    expectJest((rgb as any)[3]).toBeUndefined();
  });

  it("Конвертация из hls в rgb и обратно. Должен получиться одинаковый результат", () => {
    const hslByDefault = [200, 80, 50] as const;
    const rgb = hslToRgb(...hslByDefault);
    const hsl = rgbToHsl(...rgb);

    expectJest(hslByDefault).toEqual(hsl);
  });
});
