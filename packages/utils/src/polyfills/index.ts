import { attachSetImmediatePolyfill } from "./setImmediate";

export const attachPolyfills = () => {
  attachSetImmediatePolyfill();
};

export * from "./setImmediate";
