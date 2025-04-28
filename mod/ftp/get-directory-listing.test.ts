import { walk, type WalkOptions } from "jsr:@std/fs/walk";
import { resolve } from "jsr:@std/path/resolve";

const pathTO: string[] = ["sample", "public"];
const FOLDER: string = resolve(Deno.cwd(), ...pathTO);
const CONFIG: WalkOptions = {
  maxDepth: 1,
  includeDirs: true,
  includeFiles: true,
  followSymlinks: false, 
};

await testGetDirectoryListingByFsWalk(FOLDER, CONFIG);

async function testGetDirectoryListingByFsWalk(
  qFolder: string,
  qConfig: WalkOptions,
) {
  let i = 0;
  for await (const r of walk(qFolder, qConfig)) {
    const rType = await detectEntryType(r);

    console.log(`[${i.toString().padStart(2,'0')}] ${rType}  name: "${r.name}"  path: "${r.path}"`  );
    
    console.log(Object.fromEntries(Object.entries(await Deno.stat(r.path)).filter(([, v]) => v)));

    console.log('');
    i++;
  }
}


async function detectEntryType(r: { 
  isDirectory: boolean;
  isFile: boolean;
  isSymlink: boolean;
  name: string;
  path: string;
}): Promise<string> {
  if (r.isDirectory && !r.isSymlink) {
    return "📁";
  }
  if (r.isFile && !r.isSymlink && r.name.endsWith(".url")) {
    return "🌐";
  }
  if (r.isFile && !r.isSymlink) {
    return "📄";
  }
  if (r.isSymlink) {
    try {
      const targetInfo = await Deno.stat(r.path);
      if (targetInfo.isDirectory) {
        return "🔗📁";
      }
      if (targetInfo.isFile && r.name.endsWith(".url")) {
        return "🔗🌐";
      }
      if (targetInfo.isFile) {
        return "🔗📄";
      }
    } catch {
      return "🔗⁉️"; // np. uszkodzony symlink
    }
  }
  return "⁉️";
}
