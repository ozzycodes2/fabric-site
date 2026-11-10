import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// On dawn the accent reads under 3:1 against the canvas, so it may fill,
// edge or ring a control but never be the text or icon that identifies one.
const SRC = new URL("../src", import.meta.url).pathname;
const FORBIDDEN = [/\b(?:text|stroke|fill)-primary(?:-hover|-focus)?\b/, /\bcolor:\s*hex\("primary/];

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : /\.(tsx?|css)$/.test(e.name) ? [join(dir, e.name)] : [],
  );
}

describe("accent usage", () => {
  it("never sets text or icons in an accent role", () => {
    const hits = files(SRC).flatMap((f) =>
      readFileSync(f, "utf8")
        .split("\n")
        .flatMap((line, i) => (FORBIDDEN.some((r) => r.test(line)) ? [`${f.slice(SRC.length)}:${i + 1}`] : [])),
    );
    expect(hits).toEqual([]);
  });

  it("catches the patterns it guards against", () => {
    for (const s of ["stroke-primary", "text-primary-focus", 'color: hex("primary")'])
      expect(FORBIDDEN.some((r) => r.test(s))).toBe(true);
    for (const s of ["text-on-primary", "bg-primary", 'color: hex("on-primary")'])
      expect(FORBIDDEN.some((r) => r.test(s))).toBe(false);
  });
});
