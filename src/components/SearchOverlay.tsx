"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/db/schema";
import { categoryName } from "@/data/categories";
import { formatINR } from "@/lib/utils";
import { Icon } from "./ui";

const POPULAR = ["Lehenga", "Saree", "Gown", "Kurta", "Sherwani", "Kids", "Jhumka"];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const t = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&limit=8`, {
          signal: controller.signal,
        });
        const data = (await res.json()) as { products: Product[] };
        setResults(data.products ?? []);
      } catch {
        /* aborted or failed */
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      controller.abort();
      window.clearTimeout(t);
    };
  }, [query, open]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    onClose();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Search products">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-maroon-950/65 lg:backdrop-blur-sm"
      />
      <div className="animate-pop relative mx-auto mt-4 w-[calc(100%-1.5rem)] max-w-2xl overflow-hidden rounded-3xl border border-gold-200 bg-white shadow-card sm:mt-16">
        <form onSubmit={submit} className="flex items-center gap-3 border-b border-cream-300 px-4 py-3 sm:px-5">
          <Icon.Search className="h-5 w-5 shrink-0 text-maroon-700" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search lehenga, saree, kurta, kids wear…"
            className="h-11 w-full bg-transparent text-base text-ink-900 outline-none placeholder:text-ink-500/70"
            aria-label="Search products"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream-100 text-ink-700 hover:bg-gold-100"
            aria-label="Close search"
          >
            <Icon.X className="h-5 w-5" />
          </button>
        </form>

        <div className="max-h-[70vh] overflow-y-auto p-3 sm:p-4">
          {query.trim().length < 2 ? (
            <div>
              <p className="px-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">Popular searches</p>
              <div className="mt-3 flex flex-wrap gap-2 px-2">
                {POPULAR.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-gold-200 bg-cream-50 px-3.5 py-1.5 text-sm font-medium text-ink-700 transition hover:border-maroon-400 hover:text-maroon-800"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : loading && results.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-ink-500">Searching…</p>
          ) : results.length === 0 ? (
            <div className="px-2 py-8 text-center">
              <p className="font-semibold text-ink-900">No products found for “{query}”.</p>
              <p className="mt-1 text-sm text-ink-500">Try another word or browse the full shop.</p>
              <Link
                href="/shop"
                onClick={onClose}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-maroon-700 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Browse Shop <Icon.ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-cream-200">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 rounded-2xl px-2 py-2.5 transition hover:bg-cream-100"
                  >
                    <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-cream-200">
                      <Image src={p.image} alt="" fill sizes="48px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink-900">{p.name}</span>
                      <span className="block text-xs text-ink-500">{categoryName(p.category)}</span>
                    </span>
                    <span className="text-sm font-bold text-maroon-800">{formatINR(p.price)}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <button
                  type="submit"
                  onClick={submit}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gold-100 py-3 text-sm font-semibold text-maroon-800 transition hover:bg-gold-200"
                >
                  See all results for “{query}” <Icon.ArrowRight className="h-4 w-4" />
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
