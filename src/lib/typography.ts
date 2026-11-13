// Mirrors the typography block of DESIGN-fabric.md. globals.css declares the
// same values as Tailwind text-* tokens; test/typography.test.ts keeps the two
// in step.

export const FAMILIES = [
  {
    slug: "sans",
    name: "Inter",
    stack: "Inter, Helvetica Neue, Helvetica, Arial, system-ui, sans-serif",
    use: "Every step but code.",
    className: "font-sans",
  },
  {
    slug: "mono",
    name: "SF Mono",
    stack: "SF Mono, ui-monospace, SFMono-Regular, Menlo, monospace",
    use: "Code, values and terminal output.",
    className: "font-mono",
  },
] as const;

export type TypeStep = {
  slug: string;
  size: number;
  weight: 400 | 500 | 600;
  lineHeight: number;
  tracking: number;
  use: string;
  sample: string;
  className: string;
};

export const STEPS: TypeStep[] = [
  {
    slug: "display",
    size: 40,
    weight: 600,
    lineHeight: 1,
    tracking: -0.8,
    use: "Page titles and product tiles.",
    sample: "Color only where it signals.",
    className: "text-display",
  },
  {
    slug: "headline",
    size: 32,
    weight: 600,
    lineHeight: 1.1,
    tracking: -0.8,
    use: "Feature quotes.",
    sample: "Two polarities, one system.",
    className: "text-headline",
  },
  {
    slug: "heading",
    size: 28,
    weight: 600,
    lineHeight: 1.3,
    tracking: -0.2,
    use: "Section headings.",
    sample: "Quiet grounds, one signal",
    className: "text-heading",
  },
  {
    slug: "subhead",
    size: 20,
    weight: 400,
    lineHeight: 1.5,
    tracking: 0,
    use: "Card titles, sub-navigation, hero buttons.",
    sample: "Near-neutral grounds and one signal orange.",
    className: "text-subhead",
  },
  {
    slug: "body",
    size: 16,
    weight: 400,
    lineHeight: 1.65,
    tracking: 0,
    use: "Prose, links, buttons and inputs, at a 592px measure.",
    sample:
      "Text steps down in three inks; the orange is kept for the one thing to act on. The same seventeen roles render on either ground, so a component is declared once.",
    className: "max-w-[592px] text-body",
  },
  {
    slug: "caption",
    size: 14,
    weight: 500,
    lineHeight: 1.45,
    tracking: 0,
    use: "Captions, metadata, utility buttons, footer.",
    sample: "fabric-dusk · fabric-dawn · MIT license",
    className: "text-caption",
  },
  {
    slug: "eyebrow",
    size: 12,
    weight: 500,
    lineHeight: 1,
    tracking: 0.5,
    use: "Global navigation labels.",
    sample: "Home · Integrations · Palette · Typography",
    className: "text-eyebrow",
  },
  {
    slug: "mono",
    size: 14,
    weight: 400,
    lineHeight: 1.6,
    tracking: 0,
    use: "Inline code and code blocks.",
    sample: "--primary: #ff6a13;",
    className: "font-mono text-mono",
  },
];

export const specOf = (s: TypeStep) => `${s.size}px / ${s.weight} / ${s.lineHeight} / ${s.tracking}px`;
