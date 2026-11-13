import type { MetadataRoute } from "next";
import { canvasOf, palette } from "@/lib/palette";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const dusk = canvasOf(palette, "dusk");
  return {
    name: "fabric",
    short_name: "fabric",
    description: "A color theme in two variants, dusk and dawn.",
    start_url: "/",
    display: "browser",
    background_color: dusk,
    theme_color: dusk,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
