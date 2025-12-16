import type { Metadata } from "next/types";

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: "https://biki.com.np/",
      images: "https://biki.com.np/banner.png",
      siteName: "Better Fetch",
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@admin12121",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: "https://biki.com.np/images/og.webp",
      ...override.twitter,
    },
  };
}

export function getPageImage(page: { slugs: string[] | readonly string[] }) {
  const segments = [...page.slugs, "image.webp"];
  return {
    segments,
    url: `/images/og/${segments.join("/")}`,
  };
}

export const baseUrl =
  process.env.NODE_ENV === "development" ||
  !process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL("http://localhost:3000")
    : new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
