import data from "../../data/palette.json";

export type VariantSlug = "dusk" | "dawn";

export type Color = {
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
};

export type Role = {
  slug: string;
  name: string;
  use: string;
  dusk: Color;
  dawn: Color;
};

export type Palette = {
  version: string;
  variants: {
    slug: VariantSlug;
    id: string;
    name: string;
    appearance: string;
  }[];
  ui: Role[];
  terminal: Role[];
};

export const palette: Palette = data as Palette;
