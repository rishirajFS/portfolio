import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Silkscreen } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/layout/theme";
import { GrainOverlay } from "@/components/visuals/backdrop";
import { site } from "@/content";
import { pageMetadata, personJsonLd } from "@/lib/seo";

import "./globals.css";

/**
 * TYPOGRAPHY.
 *
 * Silkscreen is the whole interface: headings, labels, buttons, the 6px repo
 * cell names. It is a bitmap face, which is why `-webkit-font-smoothing: none`
 * is set on the body and why every type size in tokens.css is a whole integer.
 * Substituting another family at the small sizes will not work.
 *
 * JetBrains Mono carries long-form prose on project detail pages only, where
 * several paragraphs of 12px Silkscreen would be punishing to read.
 */
const pixel = Silkscreen({
  variable: "--font-pixel-src",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

const read = JetBrains_Mono({
  variable: "--font-read-src",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  ...pageMetadata(),
  metadataBase: new URL(site.siteUrl),
  authors: [{ name: site.name, url: site.siteUrl }],
  creator: site.name,
  keywords: [
    "ML systems engineer",
    "LLM inference",
    "KV cache",
    "SGLang",
    "vLLM",
    "LLM evaluation",
    "Carnegie Mellon",
    site.name,
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6d9dff" },
    { media: "(prefers-color-scheme: dark)", color: "#16213e" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${pixel.variable} ${read.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          {/* Keyboard users land here first. */}
          <a
            href="#main"
            className="sr-only-focusable bevel-btn btn-primary fixed left-6 top-6 z-[60] px-4 py-2 font-display text-sm"
          >
            Skip to content
          </a>

          <GrainOverlay />
          <SiteHeader />

          <main id="main" className="flex-1">
            {children}
          </main>

          <SiteFooter />
        </ThemeProvider>

        <script
          type="application/ld+json"
          // Structured data for search and AI crawlers. Content is generated
          // from our own content files, so there is nothing untrusted here.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
      </body>
    </html>
  );
}
