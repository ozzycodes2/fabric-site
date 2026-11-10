import type { Color, Palette, VariantSlug } from "./palette";

export type ColorFormat = "hex" | "rgb" | "hsl";

export function formatColor(c: Color, f: ColorFormat): string {
  if (f === "hex") return c.hex;
  if (f === "rgb") return `rgb(${c.rgb.join(" ")})`;
  return `hsl(${c.hsl[0]} ${c.hsl[1]}% ${c.hsl[2]}%)`;
}

// WCAG 2 relative luminance contrast ratio.
export function contrast(a: Color, b: Color): number {
  const lum = (c: Color) => {
    const [r, g, bl] = c.rgb.map((v) => {
      const s = v / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// One variant's custom properties as a :root block, for pasting into a stylesheet.
export function cssForVariant(p: Palette, v: VariantSlug): string {
  const lines = [
    ...p.ui.map((r) => `  --${r.slug}: ${r[v].hex};`),
    ...p.terminal.map((r) => `  --term-${r.slug}: ${r[v].hex};`),
  ];
  return `:root {\n${lines.join("\n")}\n}`;
}
