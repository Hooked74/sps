/* eslint-disable no-console */
import { ESLint } from "eslint";
import path from "path";
import invariant from "tiny-invariant";
import { parentPort } from "worker_threads";

import { Checker } from "../../Checker";
import {
  DiagnosticLevel,
  diagnosticToTerminalLog,
  diagnosticToViteError,
  NormalizedDiagnostic,
  normalizeEslintDiagnostic,
} from "../../logger";

import type { CreateDiagnostic } from "../../types";

const createDiagnostic: CreateDiagnostic<"eslint"> = (pluginConfig) => {
  let overlay = true; // Vite defaults to true

  return {
    config: async ({ hmr }) => {
      const viteOverlay = !(typeof hmr === "object" && hmr.overlay === false);
      if (pluginConfig.overlay === false || !viteOverlay) {
        overlay = false;
      }
    },
    async configureServer({ root }) {
      if (!pluginConfig.eslint) return;

      const extensions = pluginConfig.eslint.extensions ?? [".js"];
      const eslint = new ESLint({
        cwd: root,
        extensions,
      });
      invariant(pluginConfig.eslint, "config.eslint should not be `false`");
      invariant(
        pluginConfig.eslint.files,
        `eslint.files is required, but got ${pluginConfig.eslint.files}`
      );

      const paths =
        typeof pluginConfig.eslint.files === "string"
          ? [pluginConfig.eslint.files]
          : pluginConfig.eslint.files;

      let diagnosticsCache: NormalizedDiagnostic[] = [];

      const dispatchDiagnostics = () => {
        diagnosticsCache.forEach((n) => {
          console.log(diagnosticToTerminalLog(n, "ESLint"));
        });

        const lastErr = diagnosticsCache?.find((err) => err.level === DiagnosticLevel.Error);

        if (lastErr && overlay) {
          parentPort?.postMessage({
            type: "ERROR",
            checker: "eslint",
            payload: {
              type: "error",
              err: diagnosticToViteError(lastErr),
            },
          });
        } else {
          parentPort?.postMessage({ checker: "eslint" });
        }
      };

      const handleFileChange = async (filePath: string, type: "change" | "unlink") => {
        if (!extensions.includes(path.extname(filePath))) return;

        if (type === "unlink") {
          const absPath = path.resolve(root, filePath);
          diagnosticsCache = diagnosticsCache.filter((d) => d.id !== absPath);
        } else if (type === "change") {
          const diagnosticsOfChangedFile = await eslint.lintFiles(filePath);
          const newDiagnostics = diagnosticsOfChangedFile
            .map((d) => normalizeEslintDiagnostic(d))
            .flat(1);
          const absPath = diagnosticsOfChangedFile[0].filePath;
          diagnosticsCache = diagnosticsCache
            .filter((d) => d.id !== absPath)
            .concat(newDiagnostics);
        }

        dispatchDiagnostics();
      };

      // initial lint
      const diagnostics = await eslint.lintFiles(paths);
      diagnosticsCache = diagnostics.map((p) => normalizeEslintDiagnostic(p)).flat(1);
      dispatchDiagnostics();

      // watch lint
      Checker.watcher.add(paths);
      Checker.watcher.on("change", async (filePath) => {
        handleFileChange(filePath, "change");
      });
      Checker.watcher.on("unlink", async (filePath) => {
        handleFileChange(filePath, "unlink");
      });
    },
  };
};

export class EslintChecker extends Checker<"eslint"> {
  public constructor() {
    super({
      name: "typescript",
      absFilePath: __filename,
      build: {
        buildBin: (pluginConfig) => {
          let ext = [".js"];
          let files: string[] = [];
          if (pluginConfig.eslint) {
            ext = pluginConfig.eslint.extensions ?? ext;
            files =
              typeof pluginConfig.eslint.files === "string"
                ? [pluginConfig.eslint.files]
                : pluginConfig.eslint.files;
          }

          return ["eslint", ["--ext", ext.join(","), ...files]];
        },
      },
      createDiagnostic,
    });
  }

  public init() {
    const createServeAndBuild = super.initMainThread();
    module.exports.createServeAndBuild = createServeAndBuild;
    super.initWorkerThread();
  }
}

const eslintChecker = new EslintChecker();
eslintChecker.prepare();
eslintChecker.init();
