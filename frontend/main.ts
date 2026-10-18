import express, { type Request, type Response } from "express";
import { loadPanels } from "./panel_loader.ts";
import { toPanelKey } from "../common/panel.ts";
import { buildStaticContent } from "./static_content_builder.ts";

const panels = await loadPanels();
const sc = await buildStaticContent(panels);

const app = express();
app.get("/", (req: Request, res: Response) => servePanel(res, "0", "0"));
app.get(
  "/\\!/:x/:y{/:_}",
  (req: Request, res: Response) => servePanel(res, req.params.x, req.params.y),
);
app.use(express.static(sc.root));
app.all("*any", (req, res) => {
  res.status(404).send("<!DOCTYPE HTML><head><title>404</title></head>");
});

app.listen({ port: 3001 });

console.log("\n╔═══════════════════════════════════════════════════╗");
console.log("║  Ready... Set... Go!                              ║");
console.log("║                                                   ║");
console.log("║  zkhr/blog frontend is listening on port 3001.    ║");
console.log("╚═══════════════════════════════════════════════════╝");

/** Renders a panel at the requested coordinates */
function servePanel(res: Response, x: string, y: string) {
  const panel = panels.get(toPanelKey({ x: parseInt(x), y: parseInt(y) }));
  const panelHtml = panel ? panel.el.outerHTML : "";
  res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>ari.blumenthal.dev</title>
    <meta
      name="description"
      content="Ari's personal blog. A mix of old and new side projects, being a new father, games I'm playing, and other similar sorts of things."
    />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
    />
    <link rel="icon" href="/images/favicon.png" />
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
    <link type="text/css" rel="stylesheet" href="/${sc.cssFilename}" />
    <link rel="preload" href="/fonts/ibmplexmono.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/MarvinVisionsBig-Bold.woff2" as="font" type="font/woff2" crossorigin>
  </head>
  <body>
    <div id="panel-matrix">${panelHtml}</div>
    <script src="/${sc.jsFilename}"></script>
  </body>
</html>`);
}
