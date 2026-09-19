"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/db/schema";
import { CATEGORIES, getCategory } from "@/data/categories";
import { filterProducts } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { ProductGrid } from "./ProductGrid";
import { Icon } from "./ui";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Discount" },
];

export function ShopClient({
  products,
  initialCategory = "all",
  initialQuery = "",
  lockedCategory,
}: {
  products: Product[];
  initialCategory?: string;
  initialQuery?: string;
  /** When set, the category chips are hidden and the list is fixed to this category */
  lockedCategory?: string;
}) {
  const [category, setCategory] = useState(lockedCategory ?? initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState("featured");
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (lockedCategory) return;
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `/shop?${qs}` : "/shop");
  }, [category, query, lockedCategory]);

  const list = useMemo(
    () => filterProducts(products, { q: query, category, sort }),
    [products, query, category, sort],
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: products.length };
    for (const c of CATEGORIES) {
      map[c.slug] = filterProducts(products, { category: c.slug }).length;
    }
    return map;
  }, [products]);

  const activeCategory = getCategory(category);

  return (
    <div>
      {/* Toolbar */}
      <div className="sticky top-[var(--header-h)] z-30 -mx-4 border-b border-gold-200/70 bg-cream-50 px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-md">
            <Icon.Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              className="h-11 w-full rounded-full border border-gold-200 bg-white pl-11 pr-4 text-sm text-ink-900 outline-none transition focus:border-maroon-500"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-ink-500">
              <span className="font-semibold text-ink-900">{list.length}</span> {list.length === 1 ? "product" : "products"}
            </p>
            <label className="flex items-center gap-2 text-sm">
              <span className="hidden text-ink-500 sm:inline">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 rounded-full border border-gold-200 bg-white px-4 text-sm font-medium text-ink-900 outline-none focus:border-maroon-500"
                aria-label="Sort products"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {!lockedCategory && (
          <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {[{ slug: "all", name: "All" }, ...CATEGORIES].map((c) => {
              const active = category === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setCategory(c.slug)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition",
                    active
                      ? "border-maroon-700 bg-maroon-700 text-white shadow-soft"
                      : "border-gold-200 bg-white text-ink-700 hover:border-maroon-400 hover:text-maroon-800",
                  )}
                >
                  {c.name}
                  <span className={cn("text-[11px]", active ? "text-gold-200" : "text-ink-500")}>{counts[c.slug]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Active filter summary */}
      {(activeCategory || query.trim()) && !lockedCategory && (
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-ink-500">
          <span>Showing</span>
          {activeCategory && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-3 py-1 font-semibold text-maroon-800">
              {activeCategory.name}
              <button type="button" onClick={() => setCategory("all")} aria-label="Clear category filter" className="ml-1 rounded-full hover:text-maroon-950">
                <Icon.X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}
          {query.trim() && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-3 py-1 font-semibold text-maroon-800">
              “{query.trim()}”
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="ml-1 rounded-full hover:text-maroon-950">
                <Icon.X className="h-3.5 w-3.5" />
              </button>
            </span>
          )}
        </div>
      )}

      <div className="mt-8">
        {list.length > 0 ? (
          <ProductGrid products={list} priorityCount={4} />
        ) : (
          <div className="rounded-3xl border border-dashed border-gold-300 bg-white px-6 py-16 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold-100 text-maroon-700">
              <Icon.Search className="h-7 w-7" />
            </span>
            <p className="mt-5 font-display text-2xl font-semibold text-maroon-900">No products match your search</p>
            <p className="mt-2 text-sm text-ink-500">Try a different keyword or clear the filters to see everything.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory(lockedCategory ?? "all");
              }}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-maroon-700 px-6 text-sm font-semibold text-white hover:bg-maroon-800"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
