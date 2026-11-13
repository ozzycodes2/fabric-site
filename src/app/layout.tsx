import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VariantScript } from "@/components/variant-script";
import { canvasOf, palette } from "@/lib/palette";
import { tokensCss } from "@/lib/tokens";
import "./globals.css";

// Variable, so the wordmark can reach weight 700 and the opsz display cut.
// globals.css turns optical sizing off everywhere else.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
});

const description = "A color theme in two variants, dusk and dawn.";

// Link previews need absolute image URLs; SITE_URL is the deployed origin.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: "fabric",
  description,
  applicationName: "fabric",
  appleWebApp: { title: "fabric" },
  openGraph: { title: "fabric", description, siteName: "fabric", type: "website" },
  twitter: { card: "summary_large_image", title: "fabric", description },
};

// Tints the browser chrome (Safari's tab bar, Chrome's Android toolbar) to the
// page ground before CSS loads. VariantToggle repaints it on a manual choice.
export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: canvasOf(palette, "dawn") },
    { media: "(prefers-color-scheme: dark)", color: canvasOf(palette, "dusk") },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: tokensCss(palette) }} />
        <VariantScript />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
