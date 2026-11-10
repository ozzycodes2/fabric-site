// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { InfoTip } from "@/components/info-tip";
import { PaletteView } from "@/components/palette-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SwatchStrip } from "@/components/swatch-strip";
import { IntegrationsList } from "@/components/integrations-list";
import { groupRoles } from "@/lib/palette-groups";
import { palette } from "@/lib/palette";
import type { Integration } from "@/lib/integrations";
import Home from "@/app/page";
import TypographyPage from "@/app/typography/page";
import { FAMILIES, STEPS } from "@/lib/typography";

vi.mock("next/navigation", () => ({ usePathname: () => "/palette" }));

afterEach(cleanup);

describe("home", () => {
  it("shows the statement and both swatch strips with no link rows", () => {
    const { container } = render(<Home />);
    expect(screen.getByRole("heading", { level: 1, name: "Color only where it signals." })).toBeTruthy();
    expect(container.querySelectorAll("figure")).toHaveLength(2);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});

describe("typography", () => {
  it("shows both families and every step set in its own class", () => {
    const { container } = render(<TypographyPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Typography" })).toBeTruthy();
    for (const f of FAMILIES) expect(screen.getByRole("button", { name: `Copy ${f.name} font stack` })).toBeTruthy();
    const rows = container.querySelectorAll("ol > li");
    expect(rows).toHaveLength(STEPS.length);
    STEPS.forEach((s, i) => {
      expect(rows[i].textContent).toContain(`${s.size}px / ${s.weight} / ${s.lineHeight} / ${s.tracking}px`);
      expect(rows[i].querySelector("p")!.className).toContain(s.className);
    });
  });
});

const mk = (slug: string, name: string, category: string): Integration => ({
  slug, name, category, type: "community", url: `https://x.test/${slug}`, tags: [], contributors: [],
});

describe("IntegrationsList", () => {
  it("filters by category", () => {
    render(<IntegrationsList integrations={[mk("a", "Alpha", "terminal"), mk("b", "Beta", "editor")]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "editor" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByRole("link", { name: /Beta/ }).getAttribute("href")).toBe("https://x.test/b");
    fireEvent.click(screen.getByRole("button", { name: "all" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("credits the first contributor when there is one", () => {
    const withContributor = { ...mk("c", "Gamma", "terminal"), contributors: [{ name: "ada", url: "https://x.test/ada" }] };
    render(<IntegrationsList integrations={[withContributor, mk("d", "Delta", "terminal")]} />);
    expect(screen.getByText("by ada")).toBeTruthy();
    expect(screen.getAllByText(/^by /)).toHaveLength(1);
  });
});

describe("PaletteView", () => {
  it("switches color format and offers Copy CSS per variant", () => {
    render(<PaletteView palette={palette} />);
    expect(screen.getAllByText("#ef6306").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "rgb" }));
    expect(screen.getAllByText("rgb(239 99 6)").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /Copy CSS for/ })).toHaveLength(2);
    expect(screen.getAllByRole("heading", { level: 3, name: "Terminal" })).toHaveLength(2);
  });

  it("tags each variant section for CSS to show only the active one", () => {
    const { container } = render(<PaletteView palette={palette} />);
    expect(Array.from(container.querySelectorAll("section")).map((s) => s.dataset.show)).toEqual(["dusk", "dawn"]);
  });

  it("paints a terminal sample in each variant's own colors", () => {
    render(<PaletteView palette={palette} />);
    const dawn = screen.getByLabelText("Terminal sample in dawn");
    const canvas = palette.ui.find((r) => r.slug === "canvas")!.dawn.rgb.join(", ");
    expect(dawn.style.background).toBe(`rgb(${canvas})`);
    expect(dawn.textContent).toContain("git status");
  });

  it("puts each role's usage note behind an info tip", () => {
    render(<PaletteView palette={palette} />);
    const primary = palette.ui.find((r) => r.slug === "primary")!;
    expect(screen.getAllByRole("button", { name: "About primary" })).toHaveLength(2);
    expect(screen.getAllByRole("tooltip").filter((t) => t.textContent === primary.use)).toHaveLength(2);
  });
});

describe("InfoTip", () => {
  it("describes its button and hides on Escape until the pointer or focus leaves", () => {
    render(<InfoTip label="About primary" text="Accent fill" />);
    const button = screen.getByRole("button", { name: "About primary" });
    const tip = screen.getByRole("tooltip");
    expect(button.getAttribute("aria-describedby")).toBe(tip.id);
    expect(tip.textContent).toBe("Accent fill");
    fireEvent.keyDown(button, { key: "Enter" });
    expect(tip.dataset.dismissed).toBeUndefined();
    fireEvent.keyDown(button, { key: "Escape" });
    expect(tip.dataset.dismissed).toBe("true");
    fireEvent.mouseLeave(button.parentElement!);
    expect(tip.dataset.dismissed).toBeUndefined();
    fireEvent.keyDown(button, { key: "Escape" });
    fireEvent.blur(button);
    expect(tip.dataset.dismissed).toBeUndefined();
  });
});

describe("groupRoles", () => {
  it("puts unmapped roles in Other", () => {
    const extra = { ...palette, ui: [...palette.ui, { ...palette.ui[0], slug: "novel" }] };
    const groups = groupRoles(extra);
    expect(groups.map((g) => g.name)).toEqual(["Accent", "Surface", "Structure", "Text", "Other"]);
    expect(groupRoles(palette).flatMap((g) => g.roles)).toHaveLength(palette.ui.length);
  });
});

describe("chrome", () => {
  it("renders nav, footer links and a strip with 7 segments", () => {
    const { container } = render(
      <>
        <SiteHeader />
        <SwatchStrip palette={palette} variant="dawn" />
        <SiteFooter />
      </>,
    );
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(Array.from(nav.querySelectorAll("a")).map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Home", "/"],
      ["Integrations", "/integrations"],
      ["Palette", "/palette"],
      ["Typography", "/typography"],
    ]);
    expect(nav.querySelector("[aria-current=page]")!.textContent).toBe("Palette");
    expect(nav.querySelectorAll("[aria-current]")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Submit an integration" })).toBeTruthy();
    expect(container.querySelectorAll("figure button[data-swatch]")).toHaveLength(7);
    expect(container.querySelector("figcaption span")!.className).toContain("capitalize");
    expect(screen.getByText("fabric-dawn")).toBeTruthy();
  });
});
