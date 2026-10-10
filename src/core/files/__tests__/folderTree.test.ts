import { buildFolderTree } from "../folderTree";
import type { FolderRef } from "../types";

const folder = (uri: string, parentUri: string | null = null): FolderRef => ({
  uri,
  name: uri.split("/").pop() ?? uri,
  parentUri,
  accessMode: "saf",
});

describe("buildFolderTree", () => {
  it("returns top-level folders as roots", () => {
    const tree = buildFolderTree([folder("a"), folder("b")]);
    expect(tree.map((n) => n.uri)).toEqual(["a", "b"]);
  });

  it("nests children under their parent", () => {
    const tree = buildFolderTree([
      folder("root"),
      folder("root/child", "root"),
      folder("root/child/grand", "root/child"),
    ]);
    expect(tree).toHaveLength(1);
    expect(tree[0].children[0].uri).toBe("root/child");
    expect(tree[0].children[0].children[0].uri).toBe("root/child/grand");
  });

  it("treats folders with unknown parents as roots", () => {
    const tree = buildFolderTree([folder("orphan", "missing")]);
    expect(tree.map((n) => n.uri)).toEqual(["orphan"]);
  });

  it("handles an empty list", () => {
    expect(buildFolderTree([])).toEqual([]);
  });
});
