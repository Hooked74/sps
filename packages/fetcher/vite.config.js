const { createLibConfig } = require("@h74-sps/vite-lib-config");

module.exports = createLibConfig({
  build: {
    lib: {
      name: "fetcher",
    },
    rollupOptions: {
      output: {
        globals: {
          axios: "axios",
          "reflect-metadata": "reflectMetadata",
          "@h74-sps/logger": "logger",
          "@h74-sps/utils": "utils",
          "@h74-sps/validation": "validation",
          "axios/lib/adapters/http": "httpAdapter",
          "axios/lib/helpers/buildURL": "buildURL",
          "axios/lib/core/buildFullPath": "buildFullPath",
          "axios/lib/helpers/cookies": "cookies",
          "axios/lib/helpers/isURLSameOrigin": "isURLSameOrigin",
          "axios/lib/utils": "axiosUtils",
          "axios/lib/adapters/xhr": "xhrAdapter",
          "http-errors": "createHttpError",
          "http-status-codes": "httpStatusCodes",
          url: "url",
        },
      },
    },
  },
});
