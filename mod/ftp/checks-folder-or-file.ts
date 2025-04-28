/**
 * @fileoverview
 * 🇺🇸 Utility functions to check whether a local path is a file or a folder.
 * 🇵🇱 Funkcje pomocnicze do sprawdzania, czy podana lokalna ścieżka jest plikiem lub katalogiem.
 * 
 * @module ./mod/ftp/checks-folder-or-file.ts
 * 
 * @source
 * [GitHub](https://github.com/mod-by-cis/hono-deno-ftp/blob/v0.2.2/mod/ftp/checks-folder-or-file.ts)
 * 
 * @jsr
 * [JSR](https://jsr.io/@cis/hono-ftp/0.2.2/mod/ftp/checks-folder-or-file.ts)
 */


/**
 * 🇺🇸 Checks if a given local path points to a file.
 * 🇵🇱 Sprawdza, czy podana lokalna ścieżka wskazuje na plik.
 * 
 * @param pathLOCAL - 🇺🇸 Local filesystem path (🇵🇱 Ścieżka lokalna do sprawdzenia)
 * @returns 🇺🇸 Promise resolving to `true` if the path is a file, otherwise `false`
 *          🇵🇱 Promise, który zwraca `true`, jeśli ścieżka wskazuje na plik, w przeciwnym razie `false`
 */
async function isFile(pathLOCAL: string): Promise<boolean> {
  try {
    const fileInfo = await Deno.stat(pathLOCAL);
    return fileInfo.isFile;
  } catch {
    return false;
  }
}

/**
 * 🇺🇸 Checks if a given local path points to a directory (folder).
 * 🇵🇱 Sprawdza, czy podana lokalna ścieżka wskazuje na katalog (folder).
 * 
 * @param pathLOCAL - 🇺🇸 Local filesystem path (🇵🇱 Ścieżka lokalna do sprawdzenia)
 * @returns 🇺🇸 Promise resolving to `true` if the path is a directory, otherwise `false`
 *          🇵🇱 Promise, który zwraca `true`, jeśli ścieżka wskazuje na katalog, w przeciwnym razie `false`
 */
async function isDirectory(pathLOCAL: string): Promise<boolean> {
  try {
    const fileInfo = await Deno.stat(pathLOCAL);
    return fileInfo.isDirectory;
  } catch {
    return false;
  }
}

/**
 * 🇺🇸 Checks the status of a given local path, determining whether it is a file and/or a folder.
 * 🇵🇱 Sprawdza status podanej lokalnej ścieżki, określając, czy jest plikiem i/lub katalogiem.
 * 
 * @param pathLOCAL - 🇺🇸 Local filesystem path (🇵🇱 Ścieżka lokalna do sprawdzenia)
 * @returns 🇺🇸 Promise resolving to a Map with "isFile" and "isFolder" as keys and booleans as values
 *          🇵🇱 Promise, który zwraca Mapę z kluczami "isFile" i "isFolder" oraz wartościami typu boolean
 */
async function status(pathLOCAL: string, ): Promise<Map<"isFile"|"isFolder", boolean>>{
  
  const s = new Map<"isFile"|"isFolder", boolean>();
  s.set("isFile", await isFile(pathLOCAL));
  s.set("isFolder", await isDirectory(pathLOCAL));
  return s;
}

/**
 * 🇺🇸 Default export: the `status` function.
 * 🇵🇱 Eksport domyślny: funkcja `status`.
 */
export default status;
