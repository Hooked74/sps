import { hslToRgb } from "../hslToRgb";
import { rgbToHsl } from "../rgbToHsl";

describe("utils/helpers/rgbToHsl", () => {
  it("Должен вернуть hsl(массив из 3х чисел)", () => {
    const rgb = rgbToHsl(123, 39, 52);

    expectJest(Array.isArray(rgb)).toBeTruthy();
    expectJest(Number.isFinite(rgb[0])).toBeTruthy();
    expectJest(Number.isFinite(rgb[1])).toBeTruthy();
    expectJest(Number.isFinite(rgb[2])).toBeTruthy();
    expectJest((rgb as any)[3]).toBeUndefined();
  });

  it("Конвертация из rgb в hsl и обратно. Должен получиться одинаковый результат", () => {
    const rgbByDefault = [123, 39, 52] as const;
    const hsl = hslToRgb(...rgbByDefault);
    const rgb = rgbToHsl(...hsl);

    expectJest(rgbByDefault).toEqual(rgb);
  });
});
