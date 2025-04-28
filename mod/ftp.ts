/**
 * @fileoverview
 * 🇺🇸 Main FTP middleware handler for Hono Deno. It validates directory paths, serves files, and generates directory listings.
 * 🇵🇱 Główny handler middleware FTP dla Hono Deno. Waliduje ścieżki katalogów, serwuje pliki i generuje listy katalogów.
 * 
 * @module ./mod/ftp.ts
 * 
 * @source
 * [GitHub](https://github.com/mod-by-cis/hono-deno-ftp/blob/v0.2.2/mod/ftp.ts)
 * 
 * @jsr
 * [JSR](https://jsr.io/@cis/hono-ftp/0.2.2/mod/ftp.ts)
 */


import type { HonoFtpOptions } from "./ftp.d.ts";
import generateDefaultHtml from "./ftp/generate-default-html.ts";
import getDirectoryListing from "./ftp/get-directory-listing.ts";
import getDirectoryCatalog from "./ftp/get-directory-catalog.ts";
import checks_folderOrFile from "./ftp/checks-folder-or-file.ts";

/**
 * @template Handler - 🇺🇸 The actual type of middleware handler (e.g., MiddlewareHandler)
 *                     🇵🇱 Typ faktycznego handlera middleware (np. MiddlewareHandler)
 * 
 * @template ServeFactory - 🇺🇸 Factory function to create the handler (e.g., serveStaticFactory)
 *                          🇵🇱 Funkcja fabryki do tworzenia handlera (np. serveStaticFactory)
 * 
 * @template WalkFn - 🇺🇸 Function that walks through the directory (e.g., std/fs walk function)
 *                    🇵🇱 Funkcja, która przechodzi przez katalog (np. funkcja `walk` z `std/fs`)
 * 
 * @param options - 🇺🇸 Configuration options for the FTP middleware.
 *                  🇵🇱 Parametr options - Opcje konfiguracyjne dla middleware FTP.
 * 
 * @returns 🇺🇸 Handler function that processes the FTP requests.
 *          🇵🇱 Zwraca funkcję handlera, która przetwarza zapytania FTP.
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

  // 🇺🇸 Middleware function
  // 🇵🇱 Tworzymy funkcję, ale potem „rzucamy” ją na Handler
  const middleware = (async (
    c: Parameters<Handler>[0], 
    next: Parameters<Handler>[1]
  ) => {
    // ^ 0️⃣) 🇺🇸 Directory validation
    // ^ 0️⃣) 🇵🇱 Walidacja katalogu
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

    // ^ 1️⃣) 🇺🇸 Filter URLs with the specified prefix
    // ^ 1️⃣) 🇵🇱 Filtrujemy tylko URL-e z prefiksem
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
        
      // ^ 2️⃣) 🇺🇸 Serve file
      // ^ 2️⃣) 🇵🇱 Serwuj plik
      if (s.get("isFile")) {
        // 🇺🇸 Simulate relative path for serveStaticFactory
        // 🇵🇱 symulujemy ścieżkę jako względną dla serveStaticFactory
        Object.defineProperty(c.req, "path", {
          get: () => path.LOCAL.replace(/^\.\//, "/")
        });
        return await serveStaticFactory({ root: "." })(c, next);
      }

      // ^ 3️⃣) 🇺🇸 Generate directory listing
      // ^ 3️⃣) 🇵🇱 Generuj listę plików
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

/**
 * 🇺🇸 Handle errors that occur during file or folder operations.
 * 🇵🇱 Funkcja obsługująca błędy podczas operacji na plikach lub folderach.
 * 
 * @param err - 🇺🇸 The error object
 *              🇵🇱 Obiekt błędu
 * @returns 🇺🇸 Error message as a string
 *          🇵🇱 Zwraca wiadomość o błędzie w postaci ciągu znaków
 */
function handleError(err: unknown): string {
  return err instanceof Error ? err.message : "Nieznany błąd";
}


/**
 * 🇺🇸 Default export: the `honoDenoFtp` function.
 * 🇵🇱 Eksport domyślny: funkcja `honoDenoFtp`.
 */
export { honoDenoFtp };
