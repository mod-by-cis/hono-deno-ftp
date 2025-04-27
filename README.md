# hono-deno-ftp

> a version
>
> - `🆕v0.2.0` -> `📦https://raw.githubusercontent.com/mod-by-cis/hono-deno-ftp/refs/tags/v0.2.0/mod.ts`

## 📦HOW INSTALL

1. 🅰️ or add import in **`deno.json`**

   ```json
   {
     "imports": {  
       "hono-ftp": "https://raw.githubusercontent.com/mod-by-cis/hono-deno-ftp/refs/tags/v0.2.0/mod.ts"
     }
   }
   ```

   and next

   ```typescript
   import { type HonoFtpOptions, honoDenoFtp } from "hono-ftp";
   ```
2. 🅱️ or add import in **any `*.ts` files**

   ```typescript
   import { 
     honoDenoFtp
   } from "https://raw.githubusercontent.com/mod-by-cis/hono-deno-ftp/refs/tags/v0.2.0/mod.ts";
   ```

## 🧠 HOW USED

```typescript

export { Hono } from "jsr:@hono/hono@4.7.7";
export { logger } from "jsr:@hono/hono@4.7.7/logger";
export { poweredBy } from "jsr:@hono/hono@4.7.7/powered-by";
export { serveStatic } from "jsr:@hono/hono@4.7.7/deno";
export { appendTrailingSlash, trimTrailingSlash } from "jsr:@hono/hono@4.7.7/trailing-slash";
export type { MiddlewareHandler } from "jsr:@hono/hono@4.7.7";
export { walk } from "jsr:@std/fs@1.0.17/walk";
import { type HonoFtpOptions, honoDenoFtp } from "https://raw.githubusercontent.com/mod-by-cis/hono-deno-ftp/refs/tags/v0.2.0/mod.ts";


const appMain = new Hono();
const configFTP: HonoFtpOptions = {
    dir: "./sample/public",
    url: "/f",
    deps: [serveStatic, walk],
    // layout: (urlPath, entries) => customHtml
    // layout: (urlPath, entries) => customHtml
      /*layout: (urlPath, entries) => {
        console.log("#############", entries);
        const parentPath = urlPath.replace(/\/+$/, "").split("/").slice(0, -1).join("/") || "/";
        return `
          <!DOCTYPE html>
          <html lang="pl">
          <head>
            <meta charset="UTF-8" />
            <title>Katalog ${urlPath}</title>
            <style>
              body { font-family: sans-serif; padding: 2rem; background: #f0f0f0; }
              ul { list-style-type: none; padding: 0; }
              li { margin: 0.3rem 0; }
              a { color: #007bff; text-decoration: none; }
              a:hover { text-decoration: underline; }
              .nav { margin-bottom: 1rem; }
            </style>
          </head>
          <body>
            <h2>📁 Index of ${urlPath}</h2>
            <div class="nav">
              ${urlPath !== "/" ? `<a href="${parentPath}/">↩️ W górę</a>` : ""}
            </div>
            <ul>
              ${entries.map(e => `<li><a href="${urlPath}${e}">${e}</a></li>`).join("")}
            </ul>
            <hr />
            <footer><small>Hono-FTP + przycisk "W górę" 🦕</small></footer>
          </body>
          </html>
        `;
      }*/
  };

appMain.use("*", logger(), poweredBy());
appMain.use("*", trimTrailingSlash());

// Przekazujesz swój Handler jako generyk i serveStatic jako fabrykę:
appMain.use(honoDenoFtp< MiddlewareHandler, typeof serveStatic, typeof walk >(configFTP));

appMain.get('/', (c) => {
  // return c.redirect('/f', 301);
  return c.redirect('/f');
});

Deno.serve(/*{port:8007},*/ appMain.fetch);


```

---
