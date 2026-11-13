import { describe, expect, it } from "vitest";
import { palette } from "@/lib/palette";
import { tokensCss } from "@/lib/tokens";

const css = tokensCss(palette);

function block(selector: string): string {
  const start = css.indexOf(selector);
  expect(start).toBeGreaterThanOrEqual(0);
  const open = css.indexOf("{", start);
  return css.slice(open, css.indexOf("}", open));
}

describe("tokensCss", () => {
  it("declares dusk values in the dusk block", () => {
    expect(block('[data-variant="dusk"]')).toContain("--canvas: #010102");
  });

  it("declares dawn values in the dawn block", () => {
    expect(block('[data-variant="dawn"]')).toContain("--canvas: #eceef0");
  });

  it("emits terminal custom properties", () => {
    expect(css).toContain("--term-red:");
    expect(css).toContain("--term-bright-white:");
  });

  it("defaults to dusk and follows a light OS preference through media query", () => {
    expect(block(":root")).toContain("--canvas: #010102");
    const media = css.indexOf("@media (prefers-color-scheme: light)");
    expect(media).toBeGreaterThanOrEqual(0);
    const after = css.slice(media);
    expect(after).toContain(":root:not([data-variant])");
    expect(after).toContain("--canvas: #eceef0");
  });

  it("puts explicit variant blocks after the media query so they override it", () => {
    expect(css.indexOf('[data-variant="dusk"]')).toBeGreaterThan(
      css.indexOf("@media"),
    );
    expect(css.lastIndexOf('[data-variant="dawn"]')).toBeGreaterThan(
      css.indexOf("@media"),
    );
  });

  it("never uses dark or light as a token name", () => {
    expect(css.replace("prefers-color-scheme: light", "")).not.toMatch(
      /dark|light/i,
    );
  });
});
