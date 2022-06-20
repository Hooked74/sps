import { hueToRgb } from "./hueToRgb";

export const hslToRgb = (h: int, s: int, l: int) => {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: int, g: int, b: int;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)] as const;
};
