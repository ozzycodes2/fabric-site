// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { PaletteView } from "@/components/palette-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SwatchStrip } from "@/components/swatch-strip";
import { ThemesList } from "@/components/themes-list";
import { groupRoles } from "@/lib/palette-groups";
import { palette } from "@/lib/palette";
import type { Port } from "@/lib/ports";
import Home from "@/app/page";

afterEach(cleanup);

describe("home", () => {
  it("lists integrations and leaves the palette row without counts", () => {
    const { container } = render(<Home />);
    expect(screen.getByRole("link", { name: "All integrations" }).getAttribute("href")).toBe("/themes");
    expect(screen.getByText("1 integration")).toBeTruthy();
    const paletteRow = screen.getByRole("link", { name: "Palette" }).closest("li")!;
    expect(paletteRow.querySelector("small")).toBeNull();
    expect(container.textContent).not.toMatch(/\bports?\b|roles/);
  });
});

const mk = (slug: string, name: string, category: string): Port => ({
  slug, name, category, type: "community", url: `https://x.test/${slug}`, tags: [], contributors: [],
});

describe("ThemesList", () => {
  it("filters by category", () => {
    render(<ThemesList ports={[mk("a", "Alpha", "terminal"), mk("b", "Beta", "editor")]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "editor" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Beta" }).getAttribute("href")).toBe("https://x.test/b");
    fireEvent.click(screen.getByRole("button", { name: "all" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});

describe("PaletteView", () => {
  it("switches colour format and offers Copy CSS per variant", () => {
    render(<PaletteView palette={palette} />);
    expect(screen.getAllByText("#ef6306").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "rgb" }));
    expect(screen.getAllByText("rgb(239 99 6)").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /Copy CSS for/ })).toHaveLength(2);
    expect(screen.getAllByRole("heading", { level: 3, name: "Terminal" })).toHaveLength(2);
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
    expect(screen.getByRole("link", { name: "Palette" }).getAttribute("href")).toBe("/palette");
    expect(screen.getByRole("link", { name: "Submit an integration" })).toBeTruthy();
    expect(container.querySelectorAll("figure span[title]")).toHaveLength(7);
    expect(container.querySelector("figcaption span")!.className).toContain("capitalize");
    expect(screen.getByText("fabric-dawn")).toBeTruthy();
  });
});
