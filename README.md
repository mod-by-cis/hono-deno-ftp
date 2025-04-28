# 🔥🦕📂 @cis/hono-ftp (mod-by-cis/hono-deno-ftp)

## 📦 HOW USED - INSTALL

- 1️⃣ Imports required for proper operation

    ```ts
    import { Hono } from "jsr:@hono/hono@4.7.8";
    import { serveStatic } from "jsr:@hono/hono@4.7.8/deno";
    import type { MiddlewareHandler } from "jsr:@hono/hono@4.7.8";
    import { walk } from "jsr:@std/fs@1.0.17/walk";
    ```

- 2️⃣ And import this module
    - 2️⃣✳️1️⃣ Directly from **<u>jsr</u>** repository
    
        ```ts
        import { type HonoFtpOptions, honoDenoFtp } from "jsr:@cis/hono-ftp@0.2.5";
        ```
    
    - 2️⃣✳️2️⃣ Directly from **<u>github</u>** repository
    
        ```ts
        import { type HonoFtpOptions, honoDenoFtp } from "https://raw.githubusercontent.com/mod-by-cis/hono-deno-ftp/refs/tags/v0.2.5/mod.ts";
        ```
    
    - 2️⃣✳️3️⃣ indirectly from **<u>deno.json</u>** 
    
        Add Package
    
         ```cmd
         deno add jsr:@cis/hono-ftp
         ```

        Import symbol

         ```ts
         import { type HonoFtpOptions, honoDenoFtp } from "@cis/hono-ftp";
         ```

    - 2️⃣✳️4️⃣ indirectly from re-exports eg. **<u>deps.ts</u>**

        ```ts
        import { type HonoFtpOptions, honoDenoFtp } from "../deps.ts";
        ```

## 🧠 HOW USED

- 🅰️ minimal configuration

    ```ts
    const appMain = new Hono();

    appMain.use(
      honoDenoFtp<
        MiddlewareHandler, 
        typeof serveStatic,
        typeof walk
      >({
        dir: "./path/to/your/rootOfFiles/folder",
        url: "/f",
        deps: [serveStatic, walk],
        // layout: (urlPath, entries) => customHtml
      } as HonoFtpOptions<
          MiddlewareHandler, 
          typeof serveStatic, 
          typeof walk
        >)
    );    

    appMain.get('/', (c) => {
      return c.text('Hello Hono!');
    });

    Deno.serve(/*{port:8007},*/ appMain.fetch);
    ```

- 🅱️ optionally you can overwrite the layout of our FTP

    ```ts
    const appMain = new Hono();

    appMain.use(
      honoDenoFtp<
        MiddlewareHandler, 
        typeof serveStatic,
        typeof walk
      >({
        dir: "./path/to/your/rootOfFiles/folder",
        url: "/f",
        deps: [serveStatic, walk],
        layout: (urlPath, entries) => {
        console.log("#############", entries);
        const parentPath = urlPath.replace(/\/+$/, "").split("/").slice(0, -1).join("/") || "/";
        return `
          <!DOCTYPE html>
          <html lang="en">
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
      }
      } as HonoFtpOptions<
          MiddlewareHandler, 
          typeof serveStatic, 
          typeof walk
        >)
    );    

    appMain.get('/', (c) => {
      return c.text('Hello Hono!');
    });

    Deno.serve(/*{port:8007},*/ appMain.fetch);
    ```

---

## 🪬 About This

>  - `@cis` also called `mod-by-cis` is acronym of my surname Cisowski (Cisowscy)
>  - `hono-ftp` also called `hono-deno-ftp` - it was created to minimize unnecessary code duplication in each project - it is still a conceptual version that works correctly, but I have not checked all possible cases in which it could theoretically not work well

## 🔗 Links

- 📦 JSR [jsr.io/@cis/hono-ftp](https://jsr.io/@cis/hono-ftp)
- 📦 GITHUB [github.com/mod-by-cis/hono-deno-ftp](https://github.com/mod-by-cis/hono-deno-ftp)
