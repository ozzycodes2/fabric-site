import { describe, expect, it } from "vitest";
import { contrast, cssForVariant, formatColor } from "@/lib/color-format";
import { palette } from "@/lib/palette";

const accent = palette.ui.find((r) => r.slug === "primary")!.dusk;

describe("formatColor", () => {
  it("formats hex, rgb and hsl", () => {
    expect(formatColor(accent, "hex")).toBe("#ff6a13");
    expect(formatColor(accent, "rgb")).toBe("rgb(255 106 19)");
    expect(formatColor(accent, "hsl")).toBe("hsl(22 100% 54%)");
  });
});

describe("cssForVariant", () => {
  it("lists every custom property of one variant", () => {
    const css = cssForVariant(palette, "dawn");
    expect(css).toMatch(/^:root \{/);
    expect(css).toContain("--primary: #ff6a13;");
    expect(css).toContain("--term-red:");
    expect(css).not.toContain("--canvas: #101214");
  });
});

describe("contrast", () => {
  it("matches WCAG for black on white, in either order", () => {
    const black = { ...accent, rgb: [0, 0, 0] as [number, number, number] };
    const white = { ...accent, rgb: [255, 255, 255] as [number, number, number] };
    expect(contrast(black, white)).toBeCloseTo(21);
    expect(contrast(white, black)).toBeCloseTo(21);
    expect(contrast(accent, accent)).toBe(1);
  });
});
