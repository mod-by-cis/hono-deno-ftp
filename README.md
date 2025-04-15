# hono-deno-ftp

> a version experimentally..
>
> - `🆕v0.1.0-rc.1` -> `📦https://raw.githubusercontent.com/mod-by-cis/hono-deno-ftp/refs/tags/v0.1.0-rc.1/mod.ts`

## 📦HOW INSTALL

1. 🅰️ or add import in **`deno.json`**

   ```json
   {
     "imports": {  
       "@mod-by-cis/hono-deno-ftp": "https://raw.githubusercontent.com/mod-by-cis/hono-deno-ftp/refs/tags/v0.1.0-rc.1/mod.ts"
     }
   }
   ```
2. 🅱️ or add import in **any `*.ts` files**

   ```ts
   import { 
     honoDenoFtp
   } from "https://raw.githubusercontent.com/mod-by-cis/hono-deno-ftp/refs/tags/v0.1.0-rc.1/mod.ts";
   ```

## 🧠 HOW USED

```ts

import { Hono, Context } from "hono";
import { serveStatic } from "hono/deno";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";



const appMain = new Hono();

appMain.use("*", logger(), poweredBy());


appMain.use(honoDenoFtp({
  dir: "./public2",
  url: "/public",
  deps: [Hono, serveStatic],
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
}));

```

---
