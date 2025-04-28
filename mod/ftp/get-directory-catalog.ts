/**
 * @fileoverview
 * 🇺🇸 Creates a PATH object describing a directory catalog based on request and URL details.
 * 🇵🇱 Tworzy obiekt PATH opisujący katalog na podstawie szczegółów żądania i adresu URL.
 * 
 * @module ./mod/ftp/get-directory-catalog.ts
 * 
 * @source
 * [GitHub](https://github.com/mod-by-cis/hono-deno-ftp/blob/v0.2.6/mod/ftp/get-directory-catalog.ts)
 * 
 * @jsr
 * [JSR](https://jsr.io/@cis/hono-ftp/0.2.6/mod/ftp/get-directory-catalog.ts)
 */


import type { PATH } from "../ftp.d.ts";

/**
 * 🇺🇸 Constructs a PATH object representing the current directory view in the FTP context.
 * 🇵🇱 Tworzy obiekt PATH reprezentujący aktualny widok katalogu w kontekście FTP.
 * 
 * @param Q 🇺🇸 A tuple containing:
 * - `[0]` `c_req_raw_url` — the full raw URL of the request.
 * - `[1]` `c_req_path` — the path extracted from the request.
 * - `[2]` `url` — the mount point URL prefix.
 * - `[3]` `dir` — the base directory path.
 * 
 * 🇵🇱 Krotka zawierająca:
 * - `[0]` `c_req_raw_url` — pełny nieprzetworzony URL żądania.
 * - `[1]` `c_req_path` — ścieżkę wyciągniętą z żądania.
 * - `[2]` `url` — prefiks punktu montowania URL.
 * - `[3]` `dir` — bazową ścieżkę katalogu.
 * 
 * @returns 🇺🇸 A PATH object containing routing and local file path details.  
 *          🇵🇱 Obiekt PATH zawierający szczegóły ścieżek trasowania i lokalizacji plików.
 */
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


/**
 * 🇺🇸 Default export: the `getDirectoryCatalog` function.
 * 🇵🇱 Eksport domyślny: funkcja `getDirectoryCatalog`.
 */
export default getDirectoryCatalog;
