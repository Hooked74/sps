const { createLibConfig } = require("@h74-sps/vite-lib-config");

module.exports = createLibConfig({
  build: {
    lib: {
      name: "validation",
    },
    rollupOptions: {
      output: {
        exports: "named",
        globals: {
          joi: "joi",
          semver: "semver",
        },
      },
    },
  },
});
