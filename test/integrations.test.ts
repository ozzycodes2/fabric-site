import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getIntegrations } from "@/lib/integrations";

const integration = (name: string, extra: object = {}) =>
  JSON.stringify({
    type: "community",
    name,
    url: `https://example.com/${name}`,
    category: "editor",
    tags: [],
    contributors: [],
    ...extra,
  });

describe("getIntegrations", () => {
  it("returns the Ghostty integration with a slug from the file name", () => {
    const ghostty = getIntegrations().find((p) => p.slug === "ghostty");
    expect(ghostty?.name).toBe("Ghostty");
    expect(ghostty?.type).toBe("official");
  });

  it("sorts by name", () => {
    const dir = mkdtempSync(join(tmpdir(), "integrations-"));
    writeFileSync(join(dir, "b.json"), integration("Beta"));
    writeFileSync(join(dir, "a.json"), integration("Zed"));
    writeFileSync(join(dir, "notes.txt"), "ignored");
    expect(getIntegrations(dir).map((p) => p.name)).toEqual(["Beta", "Zed"]);
  });

  it("throws naming the file when url is missing", () => {
    const dir = mkdtempSync(join(tmpdir(), "integrations-"));
    writeFileSync(join(dir, "broken.json"), JSON.stringify({ name: "Broken", type: "official" }));
    expect(() => getIntegrations(dir)).toThrow(/broken\.json.*url/);
  });
});
