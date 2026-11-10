import type { Palette, VariantSlug } from "@/lib/palette";

export const STRIP_SLUGS = ["canvas", "surface-1", "surface-3", "ink-subtle", "ink-muted", "ink", "primary"];

export function SwatchStrip({ palette, variant }: { palette: Palette; variant: VariantSlug }) {
  const meta = palette.variants.find((v) => v.slug === variant);
  const roles = STRIP_SLUGS.map((s) => palette.ui.find((r) => r.slug === s)).filter((r) => !!r);
  return (
    <figure className="m-0">
      <figcaption className="mb-xs flex justify-between text-caption text-ink-subtle">
        <span>{meta?.name}</span>
        <span>{meta?.id}</span>
      </figcaption>
      <div className="flex h-[28px] overflow-hidden rounded-sm border border-hairline">
        {roles.map((r) => (
          <span key={r.slug} title={r.name} className="flex-1" style={{ background: r[variant].hex }} />
        ))}
      </div>
    </figure>
  );
}
