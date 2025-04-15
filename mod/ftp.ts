import type { Context, MiddlewareHandler } from "jsr:@hono/hono@4.7.6";

import generateDefaultHtml from "./ftp/generate-default-html.ts";
import getDirectoryListing from "./ftp/get-directory-listing.ts";
import getDirectoryCatalog from "./ftp/get-directory-catalog.ts";
import checks_folderOrFile from "./ftp/checks-folder-or-file.ts";

export interface PATH_NESTED {
  icon:string;
  name:string;
  href:string;
}
export interface PATH {
  START: string;
  UPPER: string;
  FULLY: string;
  ROUTE: string;
  LOCAL: string;
  TITLE: string;
}

export interface HonoFtpOptions {
  dir: string;
  url: string;
  layout?: (entries: PATH_NESTED[], path: PATH) => string;
  deps: [
    any, 
    (opts: { root: string }) => MiddlewareHandler
  ];
}


export function honoDenoFtp(options: HonoFtpOptions): MiddlewareHandler {
  const { dir, url, layout, deps } = options;
  const [, serveStatic] = deps;

  return async (c, next) => {
    // Jeśli URL nie pasuje do ścieżki, kontynuujemy dalej
    if (!c.req.path.startsWith(url)) {
      return next();
    }

    const path = getDirectoryCatalog([c.req.raw.url, c.req.path, url, dir]);  

    try {
      const s = await checks_folderOrFile(path.LOCAL);
    
      if (s.get("isFile")) {
        // symulujemy ścieżkę jako względną dla serveStatic
        Object.defineProperty(c.req, "path", {
          get: () => path.LOCAL.replace(/^\.\//, "/")
        });
        return await serveStatic({ root: "." })(c, next);
      }

      if (s.get("isFolder")) {
        const entries = await getDirectoryListing(path);
        const html = layout ? layout(entries, path) : generateDefaultHtml(entries,path);
        return c.html(html);
      }

      return c.text("Nieobsługiwany typ pliku.", 400);
    } catch (err) {
      return c.text("Błąd odczytu pliku/folderu: " + handleError(err), 404);
    }
  };
}

function handleError(err: unknown): string {
  return err instanceof Error ? err.message : "Nieznany błąd";
}

