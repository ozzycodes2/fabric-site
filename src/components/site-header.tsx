import Link from "next/link";
import { VariantToggle } from "./variant-toggle";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/themes", label: "Themes" },
  { href: "/palette", label: "Palette" },
];

export function SiteHeader() {
  return (
    <header className="flex h-[44px] items-center justify-between px-lg">
      <div className="flex items-center gap-xl">
        <Link href="/" className="inline-flex items-center gap-xxs text-[15px] font-semibold tracking-[-0.2px] text-ink">
          fabric
          <span aria-hidden className="inline-block size-[5px] bg-primary" />
        </Link>
        <nav aria-label="Primary" className="flex gap-md">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-eyebrow font-medium text-ink-muted hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
      <VariantToggle />
    </header>
  );
}
