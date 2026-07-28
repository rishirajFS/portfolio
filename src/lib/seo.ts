import type { Metadata } from "next";

import { site } from "@/content";

const base = site.siteUrl.replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetaArgs = {
  title?: string;
  description?: string;
  /** Route path, e.g. "/projects/kv-cache-eviction". */
  path?: string;
  /** Absolute or root-relative image. Defaults to the generated OG route. */
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

/**
 * Builds page metadata with the site defaults filled in, so each page only
 * declares what is actually different about it.
 */
export function pageMetadata({
  title,
  description = site.subheadline,
  path = "/",
  image,
  type = "website",
  noIndex = false,
}: PageMetaArgs = {}): Metadata {
  const fullTitle = title ? `${title} · ${site.name}` : `${site.name} · ${site.role}`;
  const url = absoluteUrl(path);
  const ogImage = image ? absoluteUrl(image) : absoluteUrl("/opengraph-image");

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

/**
 * JSON-LD for the person behind the site. Helps search engines and AI crawlers
 * attribute the work correctly.
 */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    description: site.bio.short,
    email: `mailto:${site.email}`,
    url: base,
    address: { "@type": "PostalAddress", addressLocality: site.location },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Carnegie Mellon University" },
      {
        "@type": "CollegeOrUniversity",
        name: "Vellore Institute of Technology",
      },
    ],
    sameAs: site.socials
      .filter((s) => s.external)
      .map((s) => s.href),
  };
}
