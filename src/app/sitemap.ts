import type { MetadataRoute } from "next";
import { getAllListingSlugs } from "@/lib/data/listings";
import { getDestinations } from "@/lib/data/destinations";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, destinations] = await Promise.all([getAllListingSlugs(), getDestinations()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/search`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${SITE_URL}/search?destination=${d.slug}`,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const listingRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/listing/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...destinationRoutes, ...listingRoutes];
}
