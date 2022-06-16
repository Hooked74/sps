/// <reference path="./types.d.ts" />

import { Plugin } from "vite";
import svgr, { SvgrOpts } from "@svgr/core";
import * as esbuild from "esbuild";
import fs from "fs";

const compiledSvg = new Map();

export default function VitePluginReactSvg(
  options: SvgrOpts = {},
  componentName = "ReactSvgComponent"
) {
  return {
    name: "vite-plugin-react-svg",
    async transform(source, id) {
      if (id.endsWith(".svg")) {
        let compiled = "/* @__COMPILED__ */";

        if (!source.startsWith(compiled)) {
          const svg = await fs.promises.readFile(id, "utf8");
          const componentCode = (
            await svgr(svg, options, {
              componentName,
            })
          ).replace(`export default ${componentName}`, `export { ${componentName} }`);

          const result = await esbuild.transform(`${componentCode}\n${source}`, {
            loader: "jsx",
            sourcemap: process.env.NODE_ENV === "development",
          });

          compiledSvg.set(id, { code: compiled + result.code, map: result.map || null });
        }

        if (!compiledSvg.has(id)) compiledSvg.set(id, { code: source, map: null });

        return compiledSvg.get(id);
      }
    },
  } as Plugin;
}
