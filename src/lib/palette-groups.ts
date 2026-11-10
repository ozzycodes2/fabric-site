import type { Palette, Role } from "./palette";

export const GROUPS: { name: string; slugs: string[] }[] = [
  { name: "Accent", slugs: ["primary", "on-primary", "primary-hover", "primary-focus"] },
  { name: "Surface", slugs: ["canvas", "surface-1", "surface-2", "surface-3", "surface-4"] },
  {
    name: "Structure",
    slugs: ["hairline", "hairline-strong", "hairline-tertiary", "inverse-canvas", "inverse-ink"],
  },
  { name: "Text", slugs: ["ink", "ink-muted", "ink-subtle"] },
];

// Any UI role not named above lands in a trailing "Other" group so a palette
// change cannot silently drop a swatch from the page.
export function groupRoles(p: Palette): { name: string; roles: Role[] }[] {
  const named = new Set(GROUPS.flatMap((g) => g.slugs));
  const groups = GROUPS.map((g) => ({
    name: g.name,
    roles: g.slugs.map((s) => p.ui.find((r) => r.slug === s)).filter((r): r is Role => !!r),
  }));
  const other = p.ui.filter((r) => !named.has(r.slug));
  return other.length ? [...groups, { name: "Other", roles: other }] : groups;
}
