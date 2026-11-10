import { SwatchStrip } from "@/components/swatch-strip";
import { palette } from "@/lib/palette";

export default function Home() {
  return (
    <main className="mx-auto max-w-[960px] px-lg pt-section">
      <h1 className="mb-lg max-w-[720px] text-[40px] leading-none font-semibold tracking-[-1.2px] text-balance sm:text-[56px] sm:tracking-[-2px]">
        Color only where it signals.
      </h1>
      <p className="mb-xxl max-w-[592px] text-subhead text-ink-muted">
        A theme in dusk and dawn. Near-neutral grounds and one signal orange, after the Braun products of Dieter Rams.
        The terminal palette comes from the 1970s catalog.
      </p>
      <div className="grid gap-lg sm:grid-cols-2">
        {palette.variants.map((v) => (
          <SwatchStrip key={v.slug} palette={palette} variant={v.slug} />
        ))}
      </div>
    </main>
  );
}
