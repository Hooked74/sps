import { PhoneNumberFormats } from "../constants";

export const formatPhoneNumber = (
  value: string,
  format: PhoneNumberFormats = PhoneNumberFormats.INTERNATIONAL
) => {
  let i = 0;
  return value ? format.replace(/x/g, () => value[i++]) : "";
};
