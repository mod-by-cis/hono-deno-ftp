import type { Context, MiddlewareHandler } from "jsr:@hono/hono@4.7.6";
import type { WalkEntry } from "jsr:@std/fs@1.0.16/walk";

interface HonoDenoFtpOptions {
  dir: string;
  url: string;
  layout?: (urlPath: string, entries: string[]) => string;
  deps: [any, (opts: { root: string }) => MiddlewareHandler, (root: string, opts?: object) => AsyncIterable<WalkEntry>];
}

export function honoDenoFtp(options: HonoDenoFtpOptions): MiddlewareHandler {
  const { dir, url, layout, deps } = options;
  const [HonoApp, serveStatic, walk] = deps;

  const router = new HonoApp();

  router.use(`${url}/*`, async (c: Context) => {
    const urlPath = c.req.path.replace(new RegExp(`^${url}`), "") || "/";
    const fsPath = `${dir}${urlPath}`;

    try {
      if (await isFile(fsPath)) {
        return serveStatic({ root: "./" })(c, async () => {});
      }

      if (await isDirectory(fsPath)) {
        const entries = await getDirectoryListing(fsPath, walk);
        const html = layout ? layout(urlPath, entries) : generateDefaultHtml(urlPath, entries);
        return c.html(html);
      }

      return c.text("Nieobsługiwany typ pliku.", 400);

    } catch (err) {
      const message = handleError(err);
      return c.text("Błąd odczytu pliku/folderu: " + message, 404);
    }
  });

  return router.middleware;
}

function handleError(err: unknown): string {
  return err instanceof Error ? err.message : "Nieznany błąd";
}

async function isFile(fsPath: string): Promise<boolean> {
  try {
    const fileInfo = await Deno.stat(fsPath);
    return fileInfo.isFile;
  } catch {
    return false;
  }
}

async function isDirectory(fsPath: string): Promise<boolean> {
  try {
    const fileInfo = await Deno.stat(fsPath);
    return fileInfo.isDirectory;
  } catch {
    return false;
  }
}

async function getDirectoryListing(fsPath: string, walk: HonoDenoFtpOptions["deps"][2]): Promise<string[]> {
  const entries: string[] = [];
  for await (const entry of walk(fsPath, {
    maxDepth: 1,
    includeDirs: true,
    includeFiles: true,
  })) {
    const rel = entry.path.replace(fsPath, "").replace(/\\/g, "/");
    if (rel === "") continue;
    entries.push(rel);
  }
  return entries;
}

function generateDefaultHtml(urlPath: string, entries: string[]): string {
  return `
    <html>
      <head>
        <title>Index of ${urlPath}</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; }
          ul { list-style-type: none; padding: 0; }
          li { margin: 0.3rem 0; }
          a { color: #007bff; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h2>📁 Index of ${urlPath}</h2>
        <ul>
          ${entries.map(e => `<li><a href="${urlPath}${e}">${e}</a></li>`).join("")}
        </ul>
        <hr />
        <h1>🚀🦕</h1>
      </body>
    </html>
  `;
}
