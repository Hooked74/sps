import { MESSAGE, LEVEL, SPLAT } from "triple-beam";
import { format, TransformableInfo } from "logform";

export const anyFormat = format((entry: TransformableInfo & Dictionary<any>) => {
  const excludeMessageKeys = [MESSAGE, LEVEL, SPLAT] as Array<symbol | string>;
  const message = Object.fromEntries(
    Object.entries(entry).filter(([key]) => !excludeMessageKeys.includes(key))
  );

  entry[MESSAGE] = message;

  return entry;
});
