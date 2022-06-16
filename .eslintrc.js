module.exports = {
  extends: "react-app",
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
  },
  rules: {
    "@typescript-eslint/no-redeclare": 0,
    "no-console": [
      "warn",
      {
        allow: ["warn", "error"],
      },
    ],
    "import/no-anonymous-default-export": 0,
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        args: "all",
        ignoreRestSiblings: true,
      },
    ],
    "react/react-in-jsx-scope": 0,
    "no-sequences": 0,
  },
};
