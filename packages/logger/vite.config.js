const { createLibConfig } = require("@h74-sps/vite-lib-config");

module.exports = createLibConfig({
  build: {
    lib: {
      name: "logger",
    },
    rollupOptions: {
      output: {
        globals: {
          winston: "winston",
          "winston-transport": "winstonTransport",
          "winston/lib/winston/create-logger": "createLogger",
          "triple-beam": "tripleBeam",
          logform: "logform",
          "@h74-sps/utils": "utils",
        },
      },
    },
  },
});
