/**
 * @fileoverview
 * 🇺🇸 Type definitions for the Hono FTP middleware options and associated types.
 * 🇵🇱 Definicje typów dla opcji middleware FTP Hono i powiązanych typów.
 * 
 * @module ./mod/ftp.d.ts
 * 
 * @source
 * [GitHub](https://github.com/mod-by-cis/hono-deno-ftp/blob/v0.2.2/mod/ftp.d.ts)
 * 
 * @jsr
 * [JSR](https://jsr.io/@cis/hono-ftp/0.2.2/mod/ftp.d.ts)
 */


interface PATH_NESTED {
  /** 🇺🇸 Icon representing the entry (folder or file) */
  /** 🇵🇱 Ikona reprezentująca wpis (folder lub plik) */
  icon:string;

  /** 🇺🇸 Name of the entry (folder or file) */
  /** 🇵🇱 Nazwa wpisu (folder lub plik) */
  name:string;

  /** 🇺🇸 Href link for the entry */
  /** 🇵🇱 Odnośnik href dla wpisu */
  href:string;
}

interface PATH {
  /** 🇺🇸 The start URL of the server */
  /** 🇵🇱 Początkowy URL serwera */
  START: string;

  /** 🇺🇸 The upper directory path (parent) */
  /** 🇵🇱 Ścieżka do wyższego katalogu (rodzica) */
  UPPER: string;

  /** 🇺🇸 Fully qualified URL */
  /** 🇵🇱 W pełni kwalifikowany URL */
  FULLY: string;

  /** 🇺🇸 Route (specific path) */
  /** 🇵🇱 Trasa (specyficzna ścieżka) */
  ROUTE: string;

  /** 🇺🇸 Local file path on the server */
  /** 🇵🇱 Lokalna ścieżka pliku na serwerze */
  LOCAL: string;

  /** 🇺🇸 Title of the directory or file */
  /** 🇵🇱 Tytuł katalogu lub pliku */
  TITLE: string;
}

type HonoFtpValidUrl= Exclude<`/${string}`, `/`>;
type HonoFtpValidUrl2<T extends string = string> =
  T extends `/${infer Rest}`
    ? Rest extends ""
      ? never
      : T
    : never;

/**
 * 🇺🇸 Interface defining the options for the Hono FTP middleware, including directory settings, URL routing, and layout options.
 * 🇵🇱 Interfejs definiujący opcje dla middleware FTP Hono, w tym ustawienia katalogu, routowanie URL i opcje układu.
 * 
 * @template Handler - 🇺🇸 Type of middleware handler
 *                     🇵🇱 Typ handlera middleware
 * 
 * @template ServeFactory - 🇺🇸 Factory function to create the middleware (e.g., serveStatic)
 *                          🇵🇱 Funkcja fabryki do tworzenia middleware (np. serveStatic)
 * 
 * @template WalkFn - 🇺🇸 Function that walks the directory (e.g., std/fs walk function)
 *                    🇵🇱 Funkcja, która przechodzi po katalogu (np. funkcja `walk` z `std/fs`)
 */
interface HonoFtpOptions<
  Handler,
  ServeFactory extends (opts: { root: string }) => Handler,
  WalkFn extends (
    path: string,
    options: { maxDepth: number; includeDirs: boolean; includeFiles: boolean }
  ) => AsyncIterable<{
    path: string;
    isDirectory: boolean;
    isFile: boolean;
    name: string;
  }>> {
  /** 🇺🇸 The root directory to serve files from */
  /** 🇵🇱 Katalog główny, z którego będą serwowane pliki */
  dir: string;

  /** 🇺🇸 The URL path under which the middleware should operate */
  /** 🇵🇱 Ścieżka URL, pod którą middleware ma działać */
  url: HonoFtpValidUrl; //<string> & string;//<string>; //string;

  

  /** 🇺🇸 Optional HTML rendering function for custom directory layouts */
  /** 🇵🇱 Opcjonalna funkcja renderująca HTML dla niestandardowych układów katalogów */
  layout?: (entries: PATH_NESTED[], path: PATH) => string;
  
  
  /** 
   * 🇺🇸 Dependencies:
   * - `deps[0]` is the middleware factory (e.g., serveStatic).
   * - `deps[1]` is the walk function to traverse the directory.
   * 🇵🇱 Zależności:
   * - `deps[0]` to fabryka middleware (np. serveStatic).
   * - `deps[1]` to funkcja walk do przeszukiwania katalogu.
   */
  deps: [ServeFactory, WalkFn];
}

/**
 * 🇵🇱 Typy używane w konfiguracji FTP Hono, w tym struktura ścieżek i opcje konfiguracji.
 * 🇺🇸 Types used in Hono FTP configuration, including path structures and configuration options.
 */
export type { PATH_NESTED, PATH, HonoFtpOptions, HonoFtpValidUrl };
