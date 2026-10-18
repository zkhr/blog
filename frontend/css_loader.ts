import { genRandomString } from "./utils.ts";
import { readdir, readFile, writeFile } from "node:fs/promises";

/** Combines CSS into a single file. Returns the filename of the merged css. */
export async function compileCss(distDir: string): Promise<string> {
  const outputFilename = `index-${genRandomString()}.css`;
  console.log(`    Adding ${distDir}/${outputFilename}`);

  let result = "";
  const filenames = await readdir("./client/css");
  for (const filename of filenames) {
    result += await readFile(`./client/css/${filename}`, { encoding: "utf8" });
  }

  await writeFile(`${distDir}/${outputFilename}`, result);
  return outputFilename;
}
