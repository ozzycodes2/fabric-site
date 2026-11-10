import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { FAMILIES, STEPS } from "@/lib/typography";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const token = (name: string) => css.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1];

describe("typography tokens", () => {
  it("match the Tailwind text-* tokens in globals.css", () => {
    for (const s of STEPS) {
      expect(token(`text-${s.slug}`)).toBe(`${s.size}px`);
      expect(token(`text-${s.slug}--font-weight`)).toBe(String(s.weight));
      expect(token(`text-${s.slug}--line-height`)).toBe(String(s.lineHeight));
      expect(token(`text-${s.slug}--letter-spacing`) ?? "0px").toBe(`${s.tracking}px`);
    }
  });

  it("match the font stacks after the loaded Inter variable", () => {
    const strip = (v: string) => v.replace(/"/g, "");
    expect(strip(token("font-sans")!)).toBe(FAMILIES[0].stack.replace("Inter", "var(--font-inter)"));
    expect(strip(token("font-mono")!)).toBe(FAMILIES[1].stack);
  });
});
