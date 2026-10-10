import type { FolderRef } from "./types";

export interface FolderNode {
  uri: string;
  name: string;
  parentUri: string | null;
  children: FolderNode[];
}

/**
 * Builds a forest from a flat list of folders. A folder becomes a root when its
 * `parentUri` is null or points to a folder that is not in the list.
 */
export function buildFolderTree(folders: readonly FolderRef[]): FolderNode[] {
  const nodes = new Map<string, FolderNode>();
  for (const folder of folders) {
    nodes.set(folder.uri, {
      uri: folder.uri,
      name: folder.name,
      parentUri: folder.parentUri,
      children: [],
    });
  }

  const roots: FolderNode[] = [];
  for (const folder of folders) {
    const node = nodes.get(folder.uri);
    if (!node) continue;
    const parent = folder.parentUri ? nodes.get(folder.parentUri) : undefined;
    if (parent && parent !== node) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}
