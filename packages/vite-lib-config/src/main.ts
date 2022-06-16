/// <reference types="@sps/types"/>

import { defineConfig, UserConfig } from "vite";
import checker from "@sps/vite-plugin-checker";
import { move, existsSync } from "fs-extra";

export const createLibConfig = (config: UserConfig) =>
  defineConfig({
    ...config,
    clearScreen: false,
    define: Object.entries(process.env).reduce(
      (env, [key, value]) => {
        if (/^VITE_/.test(key)) {
          (env as Dictionary<string>)[`process.env.${key}`] = JSON.stringify(value);
        }

        return env;
      },
      { ...config?.define }
    ),
    css: {
      ...config?.css,
      postcss: "./postcss.config.js",
    },
    plugins: [
      ...(config?.plugins ?? []),
      process.env.NODE_ENV === "development" &&
        checker({
          overlay: true,
          typescript: true,
          enableBuild: true,
          eslint: { files: "./src", extensions: [".ts", ".tsx"] },
        }),
      {
        name: "vite-plugin-move-cache-to-dist",
        closeBundle() {
          if (existsSync(".cache")) {
            move(".cache", "dist", { overwrite: true });
          }
        },
      },
    ].filter(Boolean),
    build: {
      ...config?.build,
      outDir: ".cache",
      minify: false,
      lib: {
        ...config?.build?.lib,
        entry: "./src/main",
      },
      rollupOptions: {
        ...config?.build?.rollupOptions,
        external:
          config?.build?.rollupOptions?.external ||
          ((source) => {
            return !/^(\.*\/|\.{1,2})/.test(source);
          }),
      },
    },
    esbuild: {
      ...config?.esbuild,
      jsxInject: `import React from 'react'`,
    },
  });
