import Link from "next/link";
import { SwatchStrip } from "@/components/swatch-strip";
import { palette } from "@/lib/palette";
import { getPorts } from "@/lib/ports";

const link = "text-ink underline decoration-1 underline-offset-2";

export default function Home() {
  const n = getPorts().length;
  const rows = [
    { label: "Ghostty", href: "https://github.com/ozzycodes2/fabric-ghostty", right: "terminal", external: true },
    { label: "All integrations", href: "/themes", right: `${n} ${n === 1 ? "integration" : "integrations"}` },
    { label: "Palette", href: "/palette" },
  ];

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
      <div className="mb-xl flex flex-col gap-md">
        {palette.variants.map((v) => (
          <SwatchStrip key={v.slug} palette={palette} variant={v.slug} />
        ))}
      </div>
      <ul className="m-0 list-none border-y border-hairline p-0">
        {rows.map((r) => (
          <li key={r.label} className="flex items-baseline justify-between border-b border-hairline py-sm text-body last:border-b-0">
            {r.external ? (
              <a href={r.href} className={link}>
                {r.label}
              </a>
            ) : (
              <Link href={r.href} className={link}>
                {r.label}
              </Link>
            )}
            {r.right && <small className="text-caption text-ink-subtle">{r.right}</small>}
          </li>
        ))}
      </ul>
    </main>
  );
}
