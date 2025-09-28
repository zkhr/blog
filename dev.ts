/** A local dev server to serve up the static content in dist/ */

import { serveDir, serveFile } from "jsr:@std/http/file-server";

Deno.serve(async (req: Request) => {
  const pathname = new URL(req.url).pathname;
  if (pathname.startsWith("/!")) {
    return serveFile(req, "dist/index.html");
  }
  const response = await serveDir(req, { fsRoot: "dist" });
  return response.status === 404 ? serveFile(req, "dist/404.html") : response;
});
