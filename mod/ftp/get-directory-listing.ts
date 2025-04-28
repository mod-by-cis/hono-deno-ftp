/**
 * @fileoverview
 * 🇺🇸 Fetches a directory listing using a provided `walkFn` and returns an array of PATH_NESTED objects with icons and hrefs.
 * 🇵🇱 Pobiera listę katalogu przy użyciu dostarczonej funkcji `walkFn` i zwraca tablicę obiektów PATH_NESTED z ikonami i odnośnikami.
 * 
 * @module ./mod/ftp/get-directory-listing.ts
 * 
 * @source
 * [GitHub](https://github.com/mod-by-cis/hono-deno-ftp/blob/v0.2.2/mod/ftp/get-directory-listing.ts)
 * 
 * @jsr
 * [JSR](https://jsr.io/@cis/hono-ftp/0.2.2/mod/ftp/get-directory-listing.ts)
 */


import type { PATH_NESTED, PATH } from "../ftp.d.ts";

/**
 * 🇺🇸 Retrieves the directory listing for a given path and returns it as an array of PATH_NESTED objects.
 * 🇵🇱 Pobiera listę katalogu dla podanej ścieżki i zwraca ją jako tablicę obiektów PATH_NESTED.
 * 
 * @param path 🇺🇸 The `PATH` object that contains details about the current path.
 *             🇵🇱 Obiekt `PATH`, który zawiera szczegóły dotyczące bieżącej ścieżki.
 * 
 * @param walkFn 🇺🇸 A function that asynchronously iterates over the directory entries.
 *                  It receives a path and options (`maxDepth`, `includeDirs`, and `includeFiles`) and returns an `AsyncIterable`.
 *               🇵🇱 Funkcja, która asynchronicznie iteruje po wpisach katalogu.
 *                  Otrzymuje ścieżkę i opcje (`maxDepth`, `includeDirs` i `includeFiles`) i zwraca `AsyncIterable`.
 * 
 * @returns 🇺🇸 An array of `PATH_NESTED` objects containing directory and file information with icons and hrefs.
 *          🇵🇱 Tablica obiektów `PATH_NESTED` zawierających informacje o katalogach i plikach z ikonami i odnośnikami.
 */
async function getDirectoryListing(
  path: PATH,
  walkFn: (path: string, options: { maxDepth: number; includeDirs: boolean; includeFiles: boolean }) => AsyncIterable<any>
): Promise<PATH_NESTED[]> {
  
  const entries: PATH_NESTED[] = [];
  let i = 0;
  for await (const entry of walkFn(path.LOCAL, {
    maxDepth: 1,
    includeDirs: true,
    includeFiles: true,
  })) {    
    const isFolder = entry.isDirectory && !entry.isSymlink;
    const isFile = entry.isFile && !entry.isSymlink && !(!entry.isDirectory && entry.name.endsWith('.url'));
    const isUrl = entry.isFile && !entry.isSymlink && (!entry.isDirectory && entry.name.endsWith('.url'));
    const isLinkFolder = entry.isDirectory && entry.isSymlink;
    const isLinkFile = entry.isFile && entry.isSymlink && !(!entry.isDirectory && entry.name.endsWith('.url'));
    const isLinkUrl = entry.isFile && entry.isSymlink && (!entry.isDirectory && entry.name.endsWith('.url'));
    const f = isFolder ? '📁' : isFile ? '📄' : isUrl ? '🌐' : isLinkFolder ? '🔗📁' : isLinkFile ? '🔗📄' : isLinkUrl ? '🔗🌐' : '⁉️';
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


/**
 * 🇺🇸 Default export: the `getDirectoryListing` function.
 * 🇵🇱 Eksport domyślny: funkcja `getDirectoryListing`.
 */
export default getDirectoryListing;
