# wersja na `hono@4.7.7` 

## moja struktura

- mod/
- - ftp/
- - - checks-folder-or-file.ts
- - - generate-default-html.ts
- - - get-directory-catalog.ts
- - - get-directory-listing.ts
- - ftp.d.ts
- - ftp.ts
- mod-deps.ts
- mod.ts
- sample/
- - public/
- - - aaaa/
- - - aaa.css
- sample-deps.ts
- sample.ts
- deno.json

## MÓJ MODUŁ 'deno-hono-ftp'

### `./mod.ts`

```typescript
export type * from "./mod/ftp.d.ts";
export * from "./mod/ftp.ts";
```

### `./mod-deps.ts`

```typescript
export { walk } from "jsr:@std/fs@1.0.17/walk";
```

### `./mod/ftp.d.ts`

```typescript
interface PATH_NESTED {
  icon:string;
  name:string;
  href:string;
}
interface PATH {
  START: string;
  UPPER: string;
  FULLY: string;
  ROUTE: string;
  LOCAL: string;
  TITLE: string;
}


/**
 * @template Handler - typ middleware, który zwróci Twoja aplikacja (np. MiddlewareHandler)
 * @template ServeFactory - fabryka tego middleware (np. serveStatic)
 */
interface HonoFtpOptions<
  Handler,
  ServeFactory extends (opts: { root: string }) => Handler
> {
  dir: string;
  url: string;
  layout?: (entries: PATH_NESTED[], path: PATH) => string;
  deps: [ServeFactory];
}

export type { PATH_NESTED, PATH, HonoFtpOptions };

```

### `./mod/ftp.ts`

```typescript
import type { HonoFtpOptions } from "./ftp.d.ts";
import generateDefaultHtml from "./ftp/generate-default-html.ts";
import getDirectoryListing from "./ftp/get-directory-listing.ts";
import getDirectoryCatalog from "./ftp/get-directory-catalog.ts";
import checks_folderOrFile from "./ftp/checks-folder-or-file.ts";

/**
 * @template Handler - faktyczny typ middleware (np. MiddlewareHandler)
 * @template ServeFactory - fabryka Handler (np. serveStaticFactory)
 */
function honoDenoFtp<
  Handler,
  ServeFactory extends (opts: { root: string }) => Handler
>(
  options: HonoFtpOptions<Handler, ServeFactory>
): Handler {
  const { dir, url, layout, deps } = options;
  const [serveStaticFactory] = deps;

 // Tworzymy funkcję, ale potem „rzucamy” ją na Handler
  const middleware = (async (c, next) => {
    // ^ 0️⃣) Walidacja katalogu
    if (!dir) {
      return c.text("Brak podanej ścieżki do folderu.", 400);
    }
    try {
      const info = await Deno.stat(dir);
      if (!info.isDirectory) {
        return c.text(`Ścieżka '${dir}' nie jest folderem.`, 400);
      }
    } catch {
      return c.text(`Folder '${dir}' nie istnieje.`, 404);
    }

    // ^ 1️⃣) Filtrujemy tylko URL-e z prefiksem
    if (!c.req.path.startsWith(url)) {
      return next();
    }

    const path = getDirectoryCatalog([
      c.req.raw.url, 
      c.req.path, 
      url, 
      dir
    ]);  

    try {
      const s = await checks_folderOrFile(path.LOCAL);
          
      // ^ 2️⃣) Serwuj plik
      if (s.get("isFile")) {
        // symulujemy ścieżkę jako względną dla serveStaticFactory
        Object.defineProperty(c.req, "path", {
          get: () => path.LOCAL.replace(/^\.\//, "/")
        });
        return await serveStaticFactory({ root: "." })(c, next);
      }

      
      // ^ 3️⃣) Generuj listing
      if (s.get("isFolder")) {
        const entries = await getDirectoryListing(path);
        if (entries.length === 0) {
          return c.text("Folder jest pusty.", 204);
        }
        const html = layout 
          ? layout(entries, path) 
          : generateDefaultHtml(entries, path);
        return c.html(html);
      }

      return c.text("Nieobsługiwany typ pliku.", 400);
    } catch (err) {
      return c.text("Błąd odczytu pliku/folderu: " + handleError(err), 404);
    }
  }) as unknown as Handler;

  return middleware;
}

function handleError(err: unknown): string {
  return err instanceof Error ? err.message : "Nieznany błąd";
}

export { honoDenoFtp };
```

### `./mod/ftp/checks-folder-or-file.ts`

```typescript
  
async function isFile(pathLOCAL: string): Promise<boolean> {
  try {
    const fileInfo = await Deno.stat(pathLOCAL);
    return fileInfo.isFile;
  } catch {
    return false;
  }
}

async function isDirectory(pathLOCAL: string): Promise<boolean> {
  try {
    const fileInfo = await Deno.stat(pathLOCAL);
    return fileInfo.isDirectory;
  } catch {
    return false;
  }
}
async function status(pathLOCAL: string, ): Promise<Map<"isFile"|"isFolder", boolean>>{
  
  const s = new Map<"isFile"|"isFolder", boolean>();
  s.set("isFile", await isFile(pathLOCAL));
  s.set("isFolder", await isDirectory(pathLOCAL));
  return s;
}


export default status;

```

### `./mod/ftp/generate-default-html.ts`

```typescript
  import type { PATH_NESTED, PATH } from "../ftp.d.ts";
function generateDefaultHtml(entries: PATH_NESTED[], path: PATH): string {
  return `
    <html>
      <head>
        <title>Index of ${path.ROUTE}</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; }
          ul { list-style-type: none; padding: 0; }
          li { margin: 0.3rem 0; }
          a { color: #007bff; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .nav { margin-bottom: 1rem; }
          code {
            font-family: monospace;
            background-color: #E8EBEEF5;
            padding: 0.2em 0.4em 0.2em 0.8em;
            border-radius: 0.2em;
          }

          pre code {
            display: block;
            padding: 1em;
            border-radius: 6px;
            overflow-x: auto;
            white-space: pre;
          }
        </style>
      </head>
      <body>
        <h2>🦕 Index of</h2>
        <hr />
        <h2>📁 <a href="${path.START}/">🔝</a> ${path.TITLE !== "/" ? `<a href="${path.UPPER}/">⤴️</a>` : ""} <code>${path.ROUTE}</code></h2>
        <ul>
          ${entries.slice(1).map(e => `<li>╰┈➤ ${e.icon} <a href="${e.href}"><code>${e.name}</code></a></li>`).join("")}
        </ul>
        <hr />
        <h1>🚀</h1>
      </body>
    </html>
  `;
}


export default generateDefaultHtml;

```

### `./mod/ftp/get-directory-catalog.ts`

```typescript
  import type { PATH } from "../ftp.d.ts";
function getDirectoryCatalog(Q:[string,string,string,string]):PATH {
  const [c_req_raw_url, c_req_path, url, dir] = Q;
  const FULLY = c_req_raw_url.replace(/\/$/, '');
  const OUTER_url = new URL(FULLY);
  const UPPER = (OUTER_url.href.slice(0, (-1*`/${OUTER_url.pathname.split('/').at(-1)}`.length))).replace(/\/$/, '');
  const ROUTE = c_req_path;
  const TITLE = ROUTE.replace(new RegExp(`^${url}`), "") || "/";
  const LOCAL = `${dir}${TITLE}`;
  const START = `${OUTER_url.protocol}//${OUTER_url.host}`;
  return {
    START,
    UPPER,
    FULLY,
    ROUTE,
    LOCAL,
    TITLE
  };
}

export default getDirectoryCatalog;

```

### `./mod/ftp/get-directory-listing.ts`

```typescript
  import { walk } from "../../deps.ts";
import type { PATH_NESTED, PATH } from "../ftp.d.ts";
async function getDirectoryListing(path: PATH): Promise<PATH_NESTED[]> {
  
  const entries: PATH_NESTED[] = [];
  let i = 0;
  for await (const entry of walk(path.LOCAL, {
    maxDepth: 1,
    includeDirs: true,
    includeFiles: true,
  })) {
    const f = entry.isDirectory ? '📁' : '📄';  
    const rel = entry.path.replace(path.LOCAL, "").replace(/\\/g, "/");
    if (rel === "") continue;
    entries.push({
      icon: f,
      name: entry.name,
      href: [...(i!=0?[path.FULLY,entry.name]:[path.FULLY])].join('/')
    });
    i++;
  }
  return entries;
}

export default getDirectoryListing;

```

--- 

## MÓJ MINIMALISTYCZNY PRZYKŁAD TESTUJĄCY MÓJ MODUŁ 'deno-hono-ftp'

### `./sample-deps.ts`

```typescript
export { Hono } from "jsr:@hono/hono@4.7.7";
export { logger } from "jsr:@hono/hono@4.7.7/logger";
export { poweredBy } from "jsr:@hono/hono@4.7.7/powered-by";
export { serveStatic } from "jsr:@hono/hono@4.7.7/deno";
export { appendTrailingSlash, trimTrailingSlash } from "jsr:@hono/hono@4.7.7/trailing-slash";
export type { MiddlewareHandler } from "jsr:@hono/hono@4.7.7";
export { walk } from "jsr:@std/fs@1.0.17/walk";
// // -----------------------------------------------------------------
export type { PATH_NESTED, PATH, HonoFtpOptions } from "./mod.ts"
export { honoDenoFtp } from "./mod.ts"

```

### `./sample.ts`

```typescript
import { 
  Hono, 
  serveStatic, 
  trimTrailingSlash,
  type MiddlewareHandler,
  logger, 
  poweredBy, 
  type HonoFtpOptions, 
  honoDenoFtp, 
} from "./sample-deps.ts";

const appMain = new Hono();

appMain.use("*", logger(), poweredBy());
appMain.use("*", trimTrailingSlash());

// Przekazujesz swój Handler jako generyk i serveStatic jako fabrykę:
appMain.use(
  honoDenoFtp<MiddlewareHandler, typeof serveStatic>({
    dir: "./sample/public",
    url: "/f",
    deps: [serveStatic],
    // layout: (urlPath, entries) => customHtml
  } as HonoFtpOptions<MiddlewareHandler, typeof serveStatic>)
);

//appMain.get('/f', (c) => {
//  // return c.redirect('/f', 301);
//  return c.redirect('/', 301);
//});

Deno.serve({port:8007}, appMain.fetch);
```

## JAKIE SĄ DALSZE KROKI??

działa poprawnie ale są pewne ostrzeżenia w `./mod/ftp.ts`; 

### problem 1
w fragmencie:
```typescript
const middleware = (async (c, next) => {
    // ^ 0️⃣) Walidacja katalogu
```
PROBLEM 1-A: 
```
Parameter 'c' implicitly has an 'any' type.deno-ts(7006)
⚠ Error (TS7006)  | 

Parameter c implicitly has an 
 type.
(parameter) c: any
```

PROBLEM 1-B: 
```
Parameter 'next' implicitly has an 'any' type.deno-ts(7006)
⚠ Error (TS7006)  | 

Parameter next implicitly has an 
 type.
(parameter) next: any
```

### problem 2
w fragmencie
```
});
        return await serveStaticFactory({ root: "." })(c, next);
      }
      
      // ^ 3️⃣) Generuj listing
```
PROBLEM 2-A: 
```
Parameter 'next' implicitly has an 'any' type.deno-ts(7006)
This expression is not callable.
  Type 'unknown' has no call signatures.deno-ts(2349)
⚠ Error (TS2349)  | 

This expression is not callable.
   

Type 
 has no call signatures.
const serveStaticFactory: ServeFactory
(opts: {
    root: string;
}) => Handler
```

