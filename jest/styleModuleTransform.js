const { readFileSync } = require("fs");

module.exports = {
  process() {
    return readFileSync(require.resolve("identity-obj-proxy")).toString();
  },
  getCacheKey() {
    return "styleModuleTransform";
  },
};
