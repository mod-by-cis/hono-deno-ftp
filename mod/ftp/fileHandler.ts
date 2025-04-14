// ./backend/utils/fileHandler.ts
import { walk } from "std/fs/walk";

export const getDirectoryListing = async (fsPath: string): Promise<string[]> => {
  const entries: string[] = [];
  for await (const entry of walk(fsPath, {
    maxDepth: 1,
    includeDirs: true,
    includeFiles: true,
  })) {
    const rel = entry.path.replace(fsPath, "").replace(/\\/g, "/");
    if (rel === "") continue;
    entries.push(rel);
  }
  return entries;
};

export const isFile = async (fsPath: string): Promise<boolean> => {
  try {
    const fileInfo = await Deno.stat(fsPath);
    return fileInfo.isFile;
  } catch {
    return false;
  }
};

export const isDirectory = async (fsPath: string): Promise<boolean> => {
  try {
    const fileInfo = await Deno.stat(fsPath);
    return fileInfo.isDirectory;
  } catch {
    return false;
  }
};
