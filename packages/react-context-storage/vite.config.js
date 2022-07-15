const { createLibConfig } = require("@h74-sps/vite-lib-config");

module.exports = createLibConfig({
  build: {
    lib: {
      name: "react-context-storage",
    },
    rollupOptions: {
      output: {
        globals: {
          react: "React",
          "@h74-sps/utils": "utils",
          "@h74-sps/logger": "logger",
          events: "events",
          immer: "immer",
        },
      },
    },
  },
});
