import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/data/categories";
import { DEMO_PRODUCTS } from "@/data/products";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/shop", "/categories", "/new-arrivals", "/about", "/contact", "/play"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const categoryRoutes = CATEGORIES.map((c) => ({
    url: `${BASE}/shop?category=${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  const productRoutes = DEMO_PRODUCTS.map((p) => ({
    url: `${BASE}/product/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
