import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getPorts } from "@/lib/ports";

const port = (name: string, extra: object = {}) =>
  JSON.stringify({
    type: "community",
    name,
    url: `https://example.com/${name}`,
    category: "editor",
    tags: [],
    contributors: [],
    ...extra,
  });

describe("getPorts", () => {
  it("returns the Ghostty port with a slug from the file name", () => {
    const ghostty = getPorts().find((p) => p.slug === "ghostty");
    expect(ghostty?.name).toBe("Ghostty");
    expect(ghostty?.type).toBe("official");
  });

  it("sorts by name", () => {
    const dir = mkdtempSync(join(tmpdir(), "ports-"));
    writeFileSync(join(dir, "b.json"), port("Beta"));
    writeFileSync(join(dir, "a.json"), port("Zed"));
    writeFileSync(join(dir, "notes.txt"), "ignored");
    expect(getPorts(dir).map((p) => p.name)).toEqual(["Beta", "Zed"]);
  });

  it("throws naming the file when url is missing", () => {
    const dir = mkdtempSync(join(tmpdir(), "ports-"));
    writeFileSync(join(dir, "broken.json"), JSON.stringify({ name: "Broken", type: "official" }));
    expect(() => getPorts(dir)).toThrow(/broken\.json.*url/);
  });
});
