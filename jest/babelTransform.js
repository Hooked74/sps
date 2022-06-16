// @remove-on-eject-begin
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
const babelJest = require("babel-jest");

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === "true") {
    return false;
  }

  try {
    require.resolve("react/jsx-runtime");
    return true;
  } catch (e) {
    return false;
  }
})();

const a = babelJest.default.createTransformer({
  presets: [
    [
      require.resolve("babel-preset-react-app"),
      {
        runtime: hasJsxRuntime ? "automatic" : "classic",
      },
    ],
  ],
  plugins: [
    "babel-plugin-transform-typescript-metadata",
    "babel-plugin-transform-vite-meta-env",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    "babel-plugin-parameter-decorator",
  ],
  babelrc: false,
  configFile: false,
});

for (let key in a) {
  let b = a[key];
  a[key] = function (...args) {
    // eslint-disable-next-line no-console
    const a = args;
    return b.call(a, ...args);
  };
}

module.exports = a;
