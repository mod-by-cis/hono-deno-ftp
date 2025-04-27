
async function isFile(pathLOCAL: string): Promise<boolean> {
  try {
    const fileInfo = await Deno.stat(pathLOCAL);
    return fileInfo.isFile;
  } catch {
    return false;
  }
}

async function isDirectory(pathLOCAL: string): Promise<boolean> {
  try {
    const fileInfo = await Deno.stat(pathLOCAL);
    return fileInfo.isDirectory;
  } catch {
    return false;
  }
}
async function status(pathLOCAL: string, ): Promise<Map<"isFile"|"isFolder", boolean>>{
  
  const s = new Map<"isFile"|"isFolder", boolean>();
  s.set("isFile", await isFile(pathLOCAL));
  s.set("isFolder", await isDirectory(pathLOCAL));
  return s;
}


export default status;
