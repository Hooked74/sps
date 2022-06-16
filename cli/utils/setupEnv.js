const fs = require("fs");
const path = require("path");

let env = process.argv.find((arg) => /^NODE_ENV=/.test(arg));
if (env) env = env.split("=")[1];

process.env.NODE_ENV = env || process.env.NODE_ENV || "development";

const NODE_ENV = process.env.NODE_ENV;
const envFilePath = path.resolve(__dirname, "../../.env");

const envFiles = [
  `${envFilePath}.${NODE_ENV}.local`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== "test" && `${envFilePath}.local`,
  `${envFilePath}.${NODE_ENV}`,
  envFilePath,
].filter(Boolean);

envFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    require("dotenv-expand").expand(
      require("dotenv").config({
        path: dotenvFile,
      })
    );
  }
});
