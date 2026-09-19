import type { Metadata } from "next";
import { ShopClient } from "@/components/ShopClient";
import { Icon } from "@/components/ui";
import { getCategory } from "@/data/categories";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ category?: string; q?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { category } = await searchParams;
  const cat = getCategory(category);
  return {
    title: cat ? `${cat.name} Collection` : "Shop All Products",
    description: cat
      ? `${cat.description} Shop ${cat.name.toLowerCase()} at Rajgharana Mega Mart - Nawada.`
      : "Browse lehenga, gown, sarees, women's, men's and kids fashion at Rajgharana Mega Mart - Nawada.",
  };
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const { category, q } = await searchParams;
  const products = await getAllProducts();
  const cat = getCategory(category);
  const key = `${category ?? "all"}|${q ?? ""}`;

  return (
    <div className="pb-20">
      <section className="paisley-bg border-b border-gold-200/60">
        <div className="container-x py-10 sm:py-14">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
            <span className="h-px w-6 bg-current" /> Shop
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-maroon-900 sm:text-5xl">
            {cat ? cat.name : "All Collections"}
          </h1>
          <p className="mt-3 max-w-xl text-ink-500">
            {cat?.description ?? "Fashion for the whole family — lehenga, gown, sarees, women's & men's wear, kids wear, ethnic collections and accessories."}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold-200 bg-white/80 px-3.5 py-1.5 text-[11px] font-medium text-ink-500">
            <Icon.Tag className="h-3.5 w-3.5 text-gold-600" />
            Demo catalogue — sample products for website preview
          </p>
        </div>
      </section>
      <div className="container-x">
        <ShopClient key={key} products={products} initialCategory={category ?? "all"} initialQuery={q ?? ""} />
      </div>
    </div>
  );
}
