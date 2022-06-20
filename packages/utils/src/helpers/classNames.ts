import { ClassNamesProperty } from "../types";

export const classNames = (...args: ClassNamesProperty[]) => {
  const classes = [];

  for (let arg of args) {
    if (!arg) continue;

    if (typeof arg === "string" || typeof arg === "number") {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      if (arg.length > 0) {
        const innerClasses = classNames(...arg) as string;
        if (innerClasses) classes.push(innerClasses);
      }
    } else if (typeof arg === "object") {
      if (arg.toString === Object.prototype.toString) {
        for (var [key, value] of Object.entries(arg)) {
          if (value) classes.push(key);
        }
      } else {
        classes.push(arg.toString());
      }
    }
  }

  return classes.join(" ");
};
