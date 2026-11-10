import { describe, expect, it } from "vitest";
import { variantScript } from "@/components/variant-script";

function run(storage: { getItem(k: string): string | null }, light = true) {
  const attrs: Record<string, string> = {};
  const document = {
    documentElement: {
      setAttribute: (k: string, v: string) => {
        attrs[k] = v;
      },
    },
  };
  const matchMedia = () => ({ matches: light });
  new Function("document", "localStorage", "matchMedia", variantScript)(
    document,
    storage,
    matchMedia,
  );
  return attrs;
}

describe("variantScript", () => {
  it("applies a stored dusk even when the OS prefers light", () => {
    expect(run({ getItem: () => "dusk" }, true)).toEqual({
      "data-variant": "dusk",
    });
  });

  it("applies a stored dawn", () => {
    expect(run({ getItem: () => "dawn" })).toEqual({ "data-variant": "dawn" });
  });

  it("reads the fabric-variant key", () => {
    const keys: string[] = [];
    run({ getItem: (k) => (keys.push(k), null) });
    expect(keys).toEqual(["fabric-variant"]);
  });

  it("leaves the attribute unset when storage is empty", () => {
    expect(run({ getItem: () => null })).toEqual({});
  });

  it("ignores unknown stored values", () => {
    expect(run({ getItem: () => "dark" })).toEqual({});
  });

  it("leaves the attribute unset when storage throws", () => {
    const throwing = {
      getItem: () => {
        throw new Error("denied");
      },
    };
    expect(run(throwing)).toEqual({});
  });
});
