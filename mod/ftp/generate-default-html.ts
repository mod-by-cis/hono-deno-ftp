/**
 * @fileoverview
 * 🇺🇸 Generates a simple default HTML page displaying a directory listing from given path entries.
 * 🇵🇱 Generuje prostą domyślną stronę HTML wyświetlającą listę katalogu na podstawie podanych ścieżek.
 * 
 * @module ./mod/ftp/generate-default-html.ts
 * 
 * @source
 * [GitHub](https://github.com/mod-by-cis/hono-deno-ftp/blob/v0.2.6/mod/ftp/generate-default-html.ts)
 * 
 * @jsr
 * [JSR](https://jsr.io/@cis/hono-ftp/0.2.6/mod/ftp/generate-default-html.ts)
 */


import type { PATH_NESTED, PATH } from "../ftp.d.ts";

/**
 * 🇺🇸 Generates a default HTML page showing the content of a folder based on provided entries
 * 🇵🇱 Generuje domyślną stronę HTML prezentującą zawartość katalogu na podstawie podanych wpisów.
 * 
 * @param entries 🇺🇸 List of entries (files/folders) to display.  
 *                🇵🇱 Lista wpisów (plików/folderów) do wyświetlenia.
 * 
 * @param path 🇺🇸 Object containing route information for navigation links.  
 *             🇵🇱 Obiekt zawierający informacje o trasie do tworzenia linków nawigacyjnych.
 * 
 * @returns 🇺🇸 A full HTML page as a string.  
 *          🇵🇱 Pełna strona HTML zwrócona jako tekst.
 */
function generateDefaultHtml(entries: PATH_NESTED[], path: PATH): string {
  return `
    <html>
      <head>
        <title>Index of ${path.ROUTE}</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; }
          ul { list-style-type: none; padding: 0; }
          li { margin: 0.3rem 0; }
          a { color: #007bff; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .nav { margin-bottom: 1rem; }
          code {
            font-family: monospace;
            background-color: #E8EBEEF5;
            padding: 0.2em 0.4em 0.2em 0.8em;
            border-radius: 0.2em;
          }

          pre code {
            display: block;
            padding: 1em;
            border-radius: 6px;
            overflow-x: auto;
            white-space: pre;
          }
        </style>
      </head>
      <body>
        <h2>🦕 Index of</h2>
        <hr />
        <h2>📁 <a href="${path.START}/">🔝</a> ${path.TITLE !== "/" ? `<a href="${path.UPPER}/">⤴️</a>` : ""} <code>${path.ROUTE}</code></h2>
        <ul>
          ${entries.slice(1).map(e => `<li>╰┈➤ ${e.icon} <a href="${e.href}"><code>${e.name}</code></a></li>`).join("")}
        </ul>
        <hr />
        <h1>🚀</h1>
      </body>
    </html>
  `;
}


/**
 * 🇺🇸 Default export: the `generateDefaultHtml` function.
 * 🇵🇱 Eksport domyślny: funkcja `generateDefaultHtml`.
 */
export default generateDefaultHtml;
