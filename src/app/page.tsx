import { SwatchStrip } from "@/components/swatch-strip";
import { palette } from "@/lib/palette";

export default function Home() {
  return (
    <main className="mx-auto max-w-[592px] px-lg pt-xxl">
      <p className="mb-md text-eyebrow font-medium uppercase tracking-[0.5px] text-ink-subtle">
        A theme in dusk and dawn
      </p>
      <h1 className="mb-md text-[32px] leading-none font-semibold tracking-[-0.8px] sm:text-display">
        Colour only where it signals.
      </h1>
      <p className="mb-xl text-body text-ink-muted">
        Near-neutral grounds and one signal orange, after the Braun products of Dieter Rams. The terminal palette comes
        from the 1970s catalogue.
      </p>
      <div className="flex flex-col gap-md">
        {palette.variants.map((v) => (
          <SwatchStrip key={v.slug} palette={palette} variant={v.slug} />
        ))}
      </div>
    </main>
  );
}
