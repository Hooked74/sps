import { hslToRgb } from "../hslToRgb";
import { rgbToHsl } from "../rgbToHsl";
import { expect } from "@jest/globals";

describe("utils/helpers/rgbToHsl", () => {
  it("Должен вернуть hsl(массив из 3х чисел)", () => {
    const rgb = rgbToHsl(123, 39, 52);

    expect(Array.isArray(rgb)).toBeTruthy();
    expect(Number.isFinite(rgb[0])).toBeTruthy();
    expect(Number.isFinite(rgb[1])).toBeTruthy();
    expect(Number.isFinite(rgb[2])).toBeTruthy();
    expect((rgb as any)[3]).toBeUndefined();
  });

  it("Конвертация из rgb в hsl и обратно. Должен получиться одинаковый результат", () => {
    const rgbByDefault = [123, 39, 52] as const;
    const hsl = hslToRgb(...rgbByDefault);
    const rgb = rgbToHsl(...hsl);

    expect(rgbByDefault).toEqual(rgb);
  });
});
