import type { Palette, VariantSlug } from "@/lib/palette";

export const STRIP_SLUGS = ["canvas", "surface-1", "surface-3", "ink-subtle", "ink-muted", "ink", "primary"];

// Painted with the variant's own hex values rather than the page tokens, so
// both variants show side by side whichever one the site is in.
export function SwatchStrip({ palette, variant }: { palette: Palette; variant: VariantSlug }) {
  const meta = palette.variants.find((v) => v.slug === variant);
  const hex = (slug: string) => palette.ui.find((r) => r.slug === slug)?.[variant].hex;
  const roles = STRIP_SLUGS.map((s) => palette.ui.find((r) => r.slug === s)).filter((r) => !!r);
  return (
    <figure
      className="m-0 flex flex-col gap-lg rounded-lg border p-lg"
      style={{ background: hex("canvas"), borderColor: hex("hairline") }}
    >
      <figcaption className="flex items-baseline justify-between text-caption" style={{ color: hex("ink-subtle") }}>
        <span className="capitalize text-subhead font-semibold" style={{ color: hex("ink") }}>
          {variant}
        </span>
        <span>{meta?.id}</span>
      </figcaption>
      <div className="flex flex-col gap-sm rounded-md p-md" style={{ background: hex("surface-1") }}>
        <span className="text-body font-medium" style={{ color: hex("ink") }}>
          Quiet grounds
        </span>
        <span className="text-caption" style={{ color: hex("ink-muted") }}>
          Text steps down in three inks; the orange is kept for the one thing to act on.
        </span>
        <span
          aria-hidden
          className="mt-xs inline-flex w-fit rounded-full px-md py-xxs text-caption"
          style={{ background: hex("primary"), color: hex("on-primary") }}
        >
          Primary
        </span>
      </div>
      <div className="flex h-[40px] overflow-hidden rounded-sm border" style={{ borderColor: hex("hairline") }}>
        {roles.map((r) => (
          <span key={r.slug} title={r.name} className="flex-1" style={{ background: r[variant].hex }} />
        ))}
      </div>
    </figure>
  );
}
