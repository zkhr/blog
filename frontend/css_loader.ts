import { genRandomString } from "./utils.ts";

/** Combines CSS into a single file. Returns the filename of the merged css. */
export async function compileCss(distDir: string): Promise<string> {
  const filename = `index-${genRandomString()}.css`;
  console.log(`    Adding ${distDir}/${filename}`);

  let result = "";
  for await (const file of Deno.readDir("./client/css")) {
    result += await Deno.readTextFile(`./client/css/${file.name}`);
  }

  await Deno.writeTextFile(`${distDir}/${filename}`, result);
  return filename;
}
