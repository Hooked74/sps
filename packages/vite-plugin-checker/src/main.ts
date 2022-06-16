import { spawn } from "child_process";
import pick from "lodash/pick";
import omit from "lodash/omit";
import npmRunPath from "npm-run-path";
import os from "os";
import { ConfigEnv, Plugin, HmrOptions, HMRPayload, UserConfig } from "vite";

import type {
  OverlayErrorAction,
  BuildInCheckerNames,
  ServeAndBuildChecker,
  UserPluginConfig,
  SharedConfig,
  BuildCheckBinStr,
  PluginConfig,
} from "./types";

export * from "./types";
export * from "./codeFrame";
export * from "./worker";

declare global {
  var lastViteCheckerTypescriptError: HMRPayload;
  var lastViteCheckerEslintError: HMRPayload;
}

const sharedConfigKeys: (keyof SharedConfig)[] = ["enableBuild", "overlay"];
const buildInCheckerKeys: BuildInCheckerNames[] = ["typescript", "vueTsc", "vls", "eslint"];

function createCheckers(
  userPluginConfig: UserPluginConfig,
  env: ConfigEnv
): ServeAndBuildChecker[] {
  const serveAndBuildCheckers: ServeAndBuildChecker[] = [];
  const sharedConfig = pick(userPluginConfig, sharedConfigKeys);

  buildInCheckerKeys.forEach((name: BuildInCheckerNames) => {
    if (!userPluginConfig[name]) return;

    const { createServeAndBuild } = require(`./checkers/${name}/main`);
    serveAndBuildCheckers.push(
      createServeAndBuild({ [name]: userPluginConfig[name], ...sharedConfig }, env)
    );
  });

  return serveAndBuildCheckers;
}

export default function VitePluginChecker(userPluginConfig: UserPluginConfig): Plugin {
  const enableBuild = userPluginConfig?.enableBuild ?? true;
  let checkers: ServeAndBuildChecker[] = [];
  let viteMode: ConfigEnv["command"] | undefined;
  let userConfig: UserConfig;

  return {
    name: "vite-plugin-checker",
    config: (config, env) => {
      // for dev mode (1/2)
      // Initialize checker with config
      userConfig = config;
      viteMode = env.command;
      checkers = createCheckers(userPluginConfig || {}, env);
      if (viteMode !== "serve") return;

      checkers.forEach((checker) => {
        const workerConfig = checker.serve.config;
        workerConfig({
          hmr: omit(config.server?.hmr as HmrOptions, ["server"]),
          env,
        });
      });
    },
    buildStart: () => {
      // for build mode
      // run a bin command in a separated process
      if (viteMode !== "build") return;

      // do not do anything when disable build mode
      if (!enableBuild) return;

      const localEnv = npmRunPath.env({
        env: process.env,
        cwd: process.cwd(),
        execPath: process.execPath,
      });

      // spawn an async runner that we don't wait for in order to avoid blocking the build from continuing in parallel
      (async () => {
        const exitCodes = await Promise.all(
          checkers.map((checker) => spawnChecker(checker, userPluginConfig, localEnv))
        );
        if (userConfig?.build?.watch) return;
        const exitCode = exitCodes.find((code) => code !== 0) ?? 0;
        if (exitCode !== 0) process.exit(exitCode);
      })();
    },
    configureServer(server) {
      // for dev mode (2/2)
      // Get the server instance and keep reference in a closure
      checkers.forEach((checker) => {
        const { worker, configureServer: workerConfigureServer } = checker.serve;
        workerConfigureServer({ root: server.config.root });
        worker.on(
          "message",
          (action: OverlayErrorAction & { checker: "eslint" | "typescript" }) => {
            if (action?.checker === "typescript") {
              global.lastViteCheckerTypescriptError =
                action?.payload?.type === "error" ? action.payload : null;
            }

            if (action?.checker === "eslint") {
              global.lastViteCheckerEslintError =
                action?.payload?.type === "error" ? action.payload : null;
            }

            if (action?.payload) server.ws.send(action.payload);
          }
        );
      });

      return () => {
        server.middlewares.use((_req, _res, next) => {
          next();
        });
      };
    },
  };
}

function spawnChecker(
  checker: ServeAndBuildChecker,
  userPluginConfig: Partial<PluginConfig>,
  localEnv: npmRunPath.ProcessEnv
) {
  return new Promise<number>((resolve) => {
    const buildBin = checker.build.buildBin;
    const finalBin: BuildCheckBinStr =
      typeof buildBin === "function" ? buildBin(userPluginConfig) : buildBin;

    const proc = spawn(...finalBin, {
      cwd: process.cwd(),
      stdio: "inherit",
      env: localEnv as any,
      shell: os.platform() === "win32",
    });

    proc.on("exit", (code) => {
      if (code !== null && code !== 0) {
        resolve(code);
      } else {
        resolve(0);
      }
    });
  });
}
