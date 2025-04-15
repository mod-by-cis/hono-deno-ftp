import { walk } from "jsr:@std/fs@1.0.16/walk";
import type { PATH_NESTED, PATH } from "../ftp.ts";
export default async function getDirectoryListing(path: PATH): Promise<PATH_NESTED[]> {
  
  const entries: PATH_NESTED[] = [];
  let i = 0;
  for await (const entry of walk(path.LOCAL, {
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
