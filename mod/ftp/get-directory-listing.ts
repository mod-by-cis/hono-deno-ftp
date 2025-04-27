import type { PATH_NESTED, PATH } from "../ftp.d.ts";
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
    const f = entry.isDirectory ? '📁' : '📄';    
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

export default getDirectoryListing;
