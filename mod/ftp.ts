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
  Handler extends (c: any, next: any) => any,
  ServeFactory extends (opts: { root: string }) => Handler,
  WalkFn extends (path: string, options: { maxDepth: number; includeDirs: boolean; includeFiles: boolean }) => AsyncIterable<any>
>(
  options: HonoFtpOptions<Handler, ServeFactory, WalkFn>
): Handler {
  const { dir, url, layout, deps } = options;
  const [serveStaticFactory, walkFn] = deps;

 // Tworzymy funkcję, ale potem „rzucamy” ją na Handler
  const middleware = (async (
    c: Parameters<Handler>[0], 
    next: Parameters<Handler>[1]
  ) => {
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
        const entries = await getDirectoryListing(path, walkFn);
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
