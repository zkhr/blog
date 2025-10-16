import { Panel, PanelKey } from "../common/panel.ts";
import { filterToJournalPanels } from "./utils.ts";
import { compileCss } from "./css_loader.ts";
import { compileJs } from "./js_loader.ts";

/** The destination directory, which can be served to render the frontend. */
const DIST_DIR = "./dist";

interface StaticContentPaths {
  cssFilename: string;
  jsFilename: string;
  root: string;
}

export async function buildStaticContent(
  panels: Map<PanelKey, Panel>,
): Promise<StaticContentPaths> {
  console.log("\nPopulating static content... ");

  await cleanDistDir();
  const cssFilename = await compileCss(DIST_DIR);
  const jsFilename = await compileJs(DIST_DIR, panels);
  await buildAtomFeed(panels, `${DIST_DIR}/rss`);
  await buildSitemap(panels, `${DIST_DIR}/sitemap.txt`);
  await copyStaticContentToDist();
  return { cssFilename, jsFilename, root: DIST_DIR };
}

async function cleanDistDir() {
  try {
    await Deno.remove(DIST_DIR, { recursive: true });
  } catch (_) {
    // If we couldn't remove the directory, it probably didn't exist yet.
  }
  await Deno.mkdir(`${DIST_DIR}/`, { recursive: true });
}

/** Copies all static content to the dist/ directory. */
async function copyStaticContentToDist() {
  const staticDirs = ["fonts", "images", "misc"];
  for (const staticDir of staticDirs) {
    const src = `./public/${staticDir}`;
    const dest = `${DIST_DIR}/${staticDir}`;
    console.log(`    Copying ${src} to ${dest}`);
    await Deno.mkdir(dest, { recursive: true });
    for await (const file of Deno.readDir(src)) {
      Deno.copyFile(`${src}/${file.name}`, `${dest}/${file.name}`);
    }
  }
}

/** Generates the atom feed using the provided panels. */
async function buildAtomFeed(
  panels: Map<PanelKey, Panel>,
  filename: string,
) {
  console.log(`    Adding ${filename}`);
  const entries = [];
  let count = 0;
  for (const panel of filterToJournalPanels(panels)) {
    let content = [...panel.el.querySelectorAll("p, h1, .section")]
      .map((x) => x.textContent?.replace(/\s+/g, " ").trim())
      .join("</p><p>");
    content = `<p>${content}</p>`
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const metadata = panel.metadata;
    const url =
      `https://ari.blumenthal.dev/!/${metadata.coordinates.x}/${metadata.coordinates.y}/${metadata.urlSuffix}`;

    entries.push(
      `<entry>
    <title>${metadata.title}</title>
    <link href="${url}"/>
    <id>${url}</id>
    <updated>${metadata.date}T12:34:56Z</updated>
    <content type="html">${content}</content>
  </entry>`,
    );

    count++;
    if (count >= 20) {
      break;
    }
  }

  await Deno.writeTextFile(
    filename,
    `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>ari.blumenthal.dev</title>
  <link href="https://ari.blumenthal.dev/" />
  <link href="https://ari.blumenthal.dev/rss" rel="self" />
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>Ari Blumenthal</name>
  </author>
  <id>https://ari.blumenthal.dev/rss</id>
  ${entries.join("\n  ")}
</feed>`,
  );
}

/** Generates the sitemap using the provided panels. */
async function buildSitemap(
  panels: Map<PanelKey, Panel>,
  filename: string,
) {
  console.log(`    Adding ${filename}`);
  const entries = [];
  const sortedPanels = [...panels.values()].sort((a, b) =>
    a.metadata.coordinates.y === b.metadata.coordinates.y
      ? a.metadata.coordinates.x - b.metadata.coordinates.x
      : b.metadata.coordinates.y - a.metadata.coordinates.y
  );
  for (const panel of sortedPanels) {
    const metadata = panel.metadata;
    const url =
      `https://ari.blumenthal.dev/!/${metadata.coordinates.x}/${metadata.coordinates.y}/${metadata.urlSuffix}`;
    entries.push(url);
  }

  // Add additional entries for other pages under ari.blumenthal.dev
  entries.push(
    "https://ari.blumenthal.dev/ariados/",
    "https://ari.blumenthal.dev/ariados/pokemon",
    "https://ari.blumenthal.dev/ariados/codes",
    "https://ari.blumenthal.dev/ariados/anagrams",
    "https://ari.blumenthal.dev/booggle/",
  );

  await Deno.writeTextFile(filename, entries.join("\n"));
}
