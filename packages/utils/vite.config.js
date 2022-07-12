const { createLibConfig } = require("@h74-sps/vite-lib-config");

module.exports = createLibConfig({
  build: {
    lib: {
      name: "utils",
    },
    rollupOptions: {
      output: {
        globals: {
          react: "React",
          uuid: "uuid",
          "file-saver": "fileSaver",
          "path-to-regexp": "pathToRegexp",
          "lodash/throttle": "throttle",
        },
      },
    },
  },
});
