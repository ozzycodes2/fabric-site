import type { Color, Palette, VariantSlug } from "./palette";

export type ColorFormat = "hex" | "rgb" | "hsl";

export function formatColor(c: Color, f: ColorFormat): string {
  if (f === "hex") return c.hex;
  if (f === "rgb") return `rgb(${c.rgb.join(" ")})`;
  return `hsl(${c.hsl[0]} ${c.hsl[1]}% ${c.hsl[2]}%)`;
}

// One variant's custom properties as a :root block, for pasting into a stylesheet.
export function cssForVariant(p: Palette, v: VariantSlug): string {
  const lines = [
    ...p.ui.map((r) => `  --${r.slug}: ${r[v].hex};`),
    ...p.terminal.map((r) => `  --term-${r.slug}: ${r[v].hex};`),
  ];
  return `:root {\n${lines.join("\n")}\n}`;
}
