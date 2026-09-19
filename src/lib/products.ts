import { cache } from "react";
import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { products, type Product } from "@/db/schema";
import { DEMO_PRODUCTS } from "@/data/products";
import { productMatchesCategory } from "@/data/categories";

let seedPromise: Promise<void> | null = null;

/** Seeds the demo catalogue once if the table is empty. */
export function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = (async () => {
      const [row] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(products);
      if (!row || row.count === 0) {
        await db.insert(products).values(DEMO_PRODUCTS).onConflictDoNothing();
      }
    })().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}

function fallbackProducts(): Product[] {
  const now = new Date();
  return DEMO_PRODUCTS.map((p, index) => ({
    id: index + 1,
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    mrp: p.mrp,
    rating: p.rating ?? 45,
    ratingCount: p.ratingCount ?? 0,
    image: p.image,
    description: p.description,
    fabric: p.fabric ?? null,
    occasion: p.occasion ?? null,
    sizes: p.sizes,
    isNew: p.isNew ?? false,
    isFestive: p.isFestive ?? false,
    isFeatured: p.isFeatured ?? false,
    createdAt: now,
  }));
}

export const getAllProducts = cache(async (): Promise<Product[]> => {
  try {
    await ensureSeeded();
    return await db
      .select()
      .from(products)
      .orderBy(desc(products.isFeatured), asc(products.id));
  } catch (error) {
    console.error("[products] falling back to demo data:", error);
    return fallbackProducts();
  }
});

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const all = await getAllProducts();
  const featured = all.filter((p) => p.isFeatured);
  const rest = all.filter((p) => !p.isFeatured);
  return [...featured, ...rest].slice(0, limit);
}

export async function getNewArrivals(): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.isNew);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => productMatchesCategory(p, slug));
}

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  try {
    await ensureSeeded();
    const [row] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);
    return row ?? null;
  } catch (error) {
    console.error("[products] falling back to demo data:", error);
    return fallbackProducts().find((p) => p.slug === slug) ?? null;
  }
});

export { filterProducts } from "./catalog";
