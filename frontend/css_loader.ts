import { genRandomString } from "./utils.ts";
import * as sass from "npm:sass-embedded";

/** Builds CSS from SCSS. Returns the filename of the generated css. */
export async function compileCss(distDir: string): Promise<string> {
  const filename = `index-${genRandomString()}.css`;
  console.log(`    Adding ${distDir}/${filename}`);

  const result = await sass.compileAsync("./client/css/main.scss");
  await Deno.writeTextFile(`${distDir}/${filename}`, result.css);
  return filename;
}
