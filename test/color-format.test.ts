import { describe, expect, it } from "vitest";
import { cssForVariant, formatColor } from "@/lib/color-format";
import { palette } from "@/lib/palette";

const accent = palette.ui.find((r) => r.slug === "primary")!.dusk;

describe("formatColor", () => {
  it("formats hex, rgb and hsl", () => {
    expect(formatColor(accent, "hex")).toBe("#ef6306");
    expect(formatColor(accent, "rgb")).toBe("rgb(239 99 6)");
    expect(formatColor(accent, "hsl")).toBe("hsl(24 95% 48%)");
  });
});

describe("cssForVariant", () => {
  it("lists every custom property of one variant", () => {
    const css = cssForVariant(palette, "dawn");
    expect(css).toMatch(/^:root \{/);
    expect(css).toContain("--primary: #ef6306;");
    expect(css).toContain("--term-red:");
    expect(css).not.toContain("--canvas: #010102");
  });
});
