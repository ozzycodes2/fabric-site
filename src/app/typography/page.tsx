import type { Metadata } from "next";
import { CopyButton } from "@/components/copy-button";
import { FAMILIES, STEPS, specOf } from "@/lib/typography";

export const metadata: Metadata = { title: "Typography · fabric" };

const WEIGHTS = [
  [400, "Regular", "font-normal"],
  [500, "Medium", "font-medium"],
  [600, "Semibold", "font-semibold"],
] as const;

export default function TypographyPage() {
  return (
    <main className="mx-auto max-w-[960px] px-lg pt-xxl">
      <h1 className="mb-md text-display">Typography</h1>
      <p className="mb-xl max-w-[592px] text-body text-ink-muted">
        Seven steps on Inter, 40px down to 12px, plus SF Mono for code. Weight is 600, 500 or 400, never lighter, and
        tracking is negative only above 20px.
      </p>

      <section aria-labelledby="families" className="mt-xxl">
        <h2 id="families" className="mb-md border-b border-hairline pb-md text-heading">
          Families
        </h2>
        <ul className="m-0 grid list-none gap-lg p-0 sm:grid-cols-2">
          {FAMILIES.map((f) => (
            <li key={f.slug} className="flex flex-col gap-md rounded-lg border border-hairline bg-surface-1 p-lg">
              <span aria-hidden className={`${f.className} text-display`}>
                Aa
              </span>
              <span className="text-subhead">{f.name}</span>
              <span className="text-caption text-ink-subtle">{f.use}</span>
              {f.slug === "sans" && (
                <span className="flex flex-wrap gap-x-md text-body text-ink-muted">
                  {WEIGHTS.map(([w, label, cls]) => (
                    <span key={w} className={cls}>
                      {label} {w}
                    </span>
                  ))}
                </span>
              )}
              <span className="mt-auto flex items-start justify-between gap-sm border-t border-hairline pt-md">
                <code className="min-w-0 font-mono text-mono text-ink-muted">{f.stack}</code>
                <CopyButton value={f.stack} label={`Copy ${f.name} font stack`} showValue={false} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="scale" className="mt-xxl">
        <h2 id="scale" className="border-b border-hairline pb-md text-heading">
          Scale
        </h2>
        <ol className="m-0 list-none p-0">
          {STEPS.map((s) => (
            <li
              key={s.slug}
              className="grid gap-sm border-b border-hairline py-lg sm:grid-cols-[240px_1fr] sm:gap-lg"
            >
              <div className="flex flex-col gap-xxs">
                <span className="text-caption text-ink">{s.slug}</span>
                <code className="font-mono text-mono text-ink-muted">{specOf(s)}</code>
                <span className="text-caption text-ink-subtle">{s.use}</span>
              </div>
              <p className={`m-0 min-w-0 break-words text-ink ${s.className}`}>{s.sample}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
