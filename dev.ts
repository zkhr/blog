/** A local dev server to serve up the static content in dist/ */

import { serveDir } from "jsr:@std/http/file-server";

Deno.serve((req: Request) => {
  return serveDir(req, { fsRoot: "dist" });
});
