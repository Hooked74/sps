import { format } from "logform";
import { anyFormat } from "./anyFormat";
import { customFormat } from "./customFormat";

type Format = typeof format;
type FormatFunctionKeys = KeyOfType<Format, Function>;
type FormatObject = Pick<Format, FormatFunctionKeys>;

export const formats = {
  ...Reflect.ownKeys(format).reduce((acc, key) => {
    const _key = key as FormatFunctionKeys;
    if (typeof format[_key] === "function") {
      (acc[_key] as ValueOf<FormatObject>) = format[_key].bind(format);
    }

    return acc;
  }, {} as FormatObject),
  custom: customFormat,
  any: anyFormat,
};
