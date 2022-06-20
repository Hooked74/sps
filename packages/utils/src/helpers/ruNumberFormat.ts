export const ruNumberFormat = (value: float | string) =>
  new Intl.NumberFormat("ru-RU").format(value as float);
