"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/integrations", label: "Integrations" },
  { href: "/palette", label: "Palette" },
  { href: "/typography", label: "Typography" },
];

export function NavLinks() {
  const path = usePathname();
  return (
    <nav aria-label="Primary" className="flex sm:gap-xxs">
      {NAV.map((n) => {
        const active = path === n.href;
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className="rounded-full px-xs py-xs text-eyebrow text-ink-muted sm:px-sm hover:text-ink aria-[current=page]:bg-surface-2 aria-[current=page]:text-ink"
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
