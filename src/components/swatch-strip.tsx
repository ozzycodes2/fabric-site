import { contrast } from "@/lib/color-format";
import type { Palette, VariantSlug } from "@/lib/palette";
import { type Swatch, SwatchBar } from "./swatch-bar";

export const STRIP_SLUGS = ["canvas", "surface-1", "surface-3", "ink-subtle", "ink-muted", "ink", "primary"];

// Painted with the variant's own hex values rather than the page tokens, so
// both variants show side by side whichever one the site is in.
export function SwatchStrip({ palette, variant }: { palette: Palette; variant: VariantSlug }) {
  const meta = palette.variants.find((v) => v.slug === variant);
  const color = (slug: string) => palette.ui.find((r) => r.slug === slug)![variant];
  const hex = (slug: string) => color(slug).hex;
  // Each label takes whichever of ink or canvas reads better on its segment.
  const swatches: Swatch[] = STRIP_SLUGS.map((s) => palette.ui.find((r) => r.slug === s))
    .filter((r) => !!r)
    .map((r) => {
      const c = r[variant];
      const ink = [color("ink"), color("canvas")].sort((a, b) => contrast(b, c) - contrast(a, c))[0];
      return { slug: r.slug, name: r.name, hex: c.hex, ink: ink.hex };
    });
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
      <SwatchBar swatches={swatches} border={hex("hairline")} />
    </figure>
  );
}
