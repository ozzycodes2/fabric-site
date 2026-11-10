// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { VariantToggle } from "@/components/variant-toggle";
import { VariantScript, variantScript } from "@/components/variant-script";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-variant");
});
afterEach(cleanup);

describe("VariantScript", () => {
  it("renders the script inline", () => {
    const html = renderToStaticMarkup(<VariantScript />);
    expect(html).toContain("<script");
    expect(html).toContain("fabric-variant");
    expect(html).toContain(variantScript.slice(0, 20));
  });
});

describe("VariantToggle", () => {
  it("offers dusk and dawn and writes attribute and storage", () => {
    render(<VariantToggle />);
    fireEvent.click(screen.getByRole("button", { name: "dawn" }));
    expect(document.documentElement.dataset.variant).toBe("dawn");
    expect(localStorage.getItem("fabric-variant")).toBe("dawn");
    fireEvent.click(screen.getByRole("button", { name: "dusk" }));
    expect(document.documentElement.dataset.variant).toBe("dusk");
    expect(localStorage.getItem("fabric-variant")).toBe("dusk");
  });

  it("marks dusk with a sunset icon and dawn with a sunrise icon, hidden from assistive tech", () => {
    render(<VariantToggle />);
    const icon = (name: string) => screen.getByRole("button", { name }).querySelector("svg")!;
    expect(icon("dusk").dataset.icon).toBe("sunset");
    expect(icon("dawn").dataset.icon).toBe("sunrise");
    expect(icon("dusk").getAttribute("aria-hidden")).toBe("true");
  });

  it("reflects the variant already on <html>", () => {
    document.documentElement.dataset.variant = "dawn";
    render(<VariantToggle />);
    expect(screen.getByRole("button", { name: "dawn" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "dusk" }).getAttribute("aria-pressed")).toBe("false");
  });

  it.each([
    [true, "dawn"],
    [false, "dusk"],
  ])("falls back to the OS preference (light=%s) when unset", (light, name) => {
    vi.stubGlobal("matchMedia", () => ({ matches: light }));
    render(<VariantToggle />);
    expect(screen.getByRole("button", { name }).getAttribute("aria-pressed")).toBe("true");
    vi.unstubAllGlobals();
  });

  it("still applies the attribute when storage throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("denied");
    });
    render(<VariantToggle />);
    fireEvent.click(screen.getByRole("button", { name: "dusk" }));
    expect(document.documentElement.dataset.variant).toBe("dusk");
    vi.restoreAllMocks();
  });
});
