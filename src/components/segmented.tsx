"use client";

type Props<T extends string> = {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

export function Segmented<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <div role="group" aria-label={label} className="inline-flex flex-wrap rounded-full border border-hairline p-[3px]">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
          className="min-h-[32px] rounded-full px-md text-caption text-ink-muted hover:text-ink aria-pressed:bg-surface-3 aria-pressed:text-ink"
        >
          {o}
        </button>
      ))}
    </div>
  );
}
