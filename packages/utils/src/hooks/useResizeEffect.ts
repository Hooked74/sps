import { useEffect } from "react";
import throttle from "lodash/throttle";

const listeners = new Set<Handler>();
const handleResize = () => listeners.forEach((listener) => listener());

export const useResizeEffect = (callback: Handler, { delay = 100, instant = true } = {}) => {
  useEffect(() => {
    const delayedCallback = delay ? throttle(callback, delay) : callback;

    if (!listeners.size) {
      window.addEventListener("resize", handleResize, { capture: false, passive: true });
      window.addEventListener("orientationchange", handleResize, { capture: false, passive: true });
    }

    if (instant) delayedCallback();
    listeners.add(delayedCallback);

    return () => {
      listeners.delete(delayedCallback);

      if (!listeners.size) {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
