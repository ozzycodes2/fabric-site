import type { Palette, VariantSlug } from "./palette";

function declarations(p: Palette, v: VariantSlug): string {
  const ui = p.ui.map((r) => `  --${r.slug}: ${r[v].hex};`);
  const term = p.terminal.map((r) => `  --term-${r.slug}: ${r[v].hex};`);
  return [...ui, ...term].join("\n");
}

// Order matters: bare :root is dusk, the media query swaps in dawn only when
// the reader has not chosen, and the explicit [data-variant] blocks come last
// so a stored choice beats the OS preference.
export function tokensCss(p: Palette): string {
  const dusk = declarations(p, "dusk");
  const dawn = declarations(p, "dawn");
  return [
    `:root {\n${dusk}\n}`,
    `@media (prefers-color-scheme: light) {\n:root:not([data-variant]) {\n${dawn}\n}\n}`,
    `[data-variant="dusk"] {\n${dusk}\n}`,
    `[data-variant="dawn"] {\n${dawn}\n}`,
  ].join("\n");
}
