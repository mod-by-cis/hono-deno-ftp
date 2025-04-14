// ./backend/utils/htmlGenerator.ts
export const generateDirectoryHtml2 = (urlPath: string, entries: string[]): string => {
  return `
    <html>
      <head>
        <title>Index of ${urlPath}</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; }
          ul { list-style-type: none; padding: 0; }
          li { margin: 0.3rem 0; }
          a { color: #007bff; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h2>📁 Index of ${urlPath}</h2>
        <ul>
          ${entries.map(e => `<li><a href="${urlPath}${e}">${e}</a></li>`).join("")}
        </ul>
        <hr />
        <h1>🚀🦕</h1>
      </body>
    </html>
  `;
};


// Domyślny layout
export function generateDirectoryHtml(_c: any, urlPath: string, entries: string[]): string {
  return `
    <html>
      <head>
        <title>Index of ${urlPath}</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; }
          ul { list-style-type: none; padding: 0; }
          li { margin: 0.3rem 0; }
          a { color: #007bff; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h2>📁 Index of ${urlPath}</h2>
        <ul>
          ${entries.map(e => `<li><a href="${urlPath}${e}">${e}</a></li>`).join("")}
        </ul>
        <h6>🚀🦕</h6>
      </body>
    </html>
  `;
}
