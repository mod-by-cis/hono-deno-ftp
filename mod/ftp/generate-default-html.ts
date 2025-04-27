import type { PATH_NESTED, PATH } from "../ftp.d.ts";
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


export default generateDefaultHtml;
