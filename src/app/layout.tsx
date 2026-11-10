import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { VariantScript } from "@/components/variant-script";
import { palette } from "@/lib/palette";
import { tokensCss } from "@/lib/tokens";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "fabric",
  description: "A colour theme in two variants, dusk and dawn.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: tokensCss(palette) }} />
        <VariantScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
