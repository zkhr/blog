import { Application, Context, Next, Router } from "@oak/oak";
import { loadPanels } from "./panel_loader.ts";
import { toPanelKey } from "../common/panel.ts";
import { buildStaticContent } from "./static_content_builder.ts";

const panels = await loadPanels();
const sc = await buildStaticContent(panels);

const router = new Router();
router.get("/", (ctx) => servePanel(ctx, "0", "0"));
router.get("/!/:x/:y", (ctx) => servePanel(ctx, ctx.params.x, ctx.params.y));
router.get("/!/:x/:y/:_", (ctx) => servePanel(ctx, ctx.params.x, ctx.params.y));

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
app.use(handleStatic);
app.use(handle404);

app.listen({ port: 3001 });

/** Renders a panel at the requested coordinates */
function servePanel(ctx: Context, x: string, y: string) {
  const panel = panels.get(toPanelKey({ x: parseInt(x), y: parseInt(y) }));
  const panelHtml = panel ? panel.el.outerHTML : "";
  ctx.response.body = `<!DOCTYPE html>
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
</html>`;
}

/** Serves content from the static content builder's root directory. */
async function handleStatic(ctx: Context<Record<string, object>>, next: Next) {
  try {
    await ctx.send({ root: sc.root });
  } catch {
    await next();
  }
}

/** Serves a blank 404 page for any unknown requests. */
async function handle404(ctx: Context<Record<string, object>>, next: Next) {
  await next();
  if (ctx.response.status === 404 && ctx.request.accepts("text/html")) {
    ctx.response.body = `<!DOCTYPE HTML><head><title>404</title></head>`;
    ctx.response.status = 404;
  }
}
