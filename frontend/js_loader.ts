import { genRandomString } from "./utils.ts";
import { bundle } from "jsr:@deno/emit";
import { Panel, PanelKey } from "../common/panel.ts";

/** Builds JS from TS sources. Returns the filename of the generated js. */
export async function compileJs(
  distDir: string,
  panels: Map<PanelKey, Panel>,
): Promise<string> {
  const filename = `index-${genRandomString()}.js`;
  console.log(`    Adding ${distDir}/${filename}`);

  const result = await bundle("client/js/app.ts");
  result.code = genPanelCode(panels) + result.code;

  await Deno.writeTextFile(`${distDir}/${filename}`, result.code);
  return filename;
}

function genPanelCode(panels: Map<PanelKey, Panel>) {
  const panelsStr = [...panels.values()]
    .map((panel) => JSON.stringify(panel.el.outerHTML))
    .join(",\n");
  return `const panels = [${panelsStr}];\n`;
}
