const LINKS = [
  { href: "https://github.com/ozzycodes2/fabric-theme", label: "GitHub" },
  { href: "https://github.com/ozzycodes2/fabric-site/issues", label: "Submit a port" },
];

export function SiteFooter() {
  return (
    <footer className="mt-section flex gap-lg bg-surface-1 px-lg py-lg text-caption text-ink-subtle">
      {LINKS.map((l) => (
        <a key={l.href} href={l.href} className="hover:text-ink">
          {l.label}
        </a>
      ))}
    </footer>
  );
}
