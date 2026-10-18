import { genRandomString } from "./utils.ts";
import { type Panel, type PanelKey } from "../common/panel.ts";
import * as esbuild from "esbuild";
import { writeFile } from "node:fs/promises";

/** Builds JS from TS sources. Returns the filename of the generated js. */
export async function compileJs(
  distDir: string,
  panels: Map<PanelKey, Panel>,
): Promise<string> {
  const filename = `index-${genRandomString()}.js`;
  console.log(`    Adding ${distDir}/${filename}`);

  const result = await esbuild.build({
    entryPoints: ["client/js/app.ts"],
    bundle: true,
    write: false,
  });
  const code = genPanelCode(panels) + result.outputFiles[0].text;
  await writeFile(`${distDir}/${filename}`, code);
  return filename;
}

function genPanelCode(panels: Map<PanelKey, Panel>) {
  const panelsStr = [...panels.values()]
    .map((panel) => JSON.stringify(panel.el.outerHTML))
    .join(",\n");
  return `const panels = [${panelsStr}];\n`;
}
