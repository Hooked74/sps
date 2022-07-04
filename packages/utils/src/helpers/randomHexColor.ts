export const randomHexColor = () =>
  `#${((Math.random() * 0xffffff) << 0).toString(16)}`.padEnd(7, "0");
