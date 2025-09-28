/** A local dev server to serve up the static content in dist/ */

import { serveDir, serveFile } from "jsr:@std/http/file-server";

Deno.serve((req: Request) => {
  const pathname = new URL(req.url).pathname;
  if (pathname.startsWith("/!")) {
    return serveFile(req, "dist/index.html");
  }
  return serveDir(req, { fsRoot: "dist" });
});
