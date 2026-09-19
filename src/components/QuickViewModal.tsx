"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/db/schema";
import { categoryName } from "@/data/categories";
import { whatsappLink } from "@/data/business";
import { useCart } from "@/lib/cart-context";
import { cn, discountPercent, formatINR } from "@/lib/utils";
import { Badge, Icon, Stars } from "./ui";

export function QuickViewModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { add, openCart } = useCart();
  const [size, setSize] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!product) return;
    setSize(product.sizes[0] ?? "Free Size");
    setQty(1);
    setAdded(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;
  const off = discountPercent(product.price, product.mrp);

  const handleAdd = () => {
    add({
      slug: product.slug,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      image: product.image,
      size,
      qty,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="quickview-title">
      <button type="button" aria-label="Close quick view" onClick={onClose} className="absolute inset-0 bg-maroon-950/70 lg:backdrop-blur-sm" />
      <div className="animate-pop relative grid max-h-[92vh] w-full max-w-4xl grid-rows-[auto_1fr] overflow-hidden rounded-t-3xl bg-white shadow-card sm:grid-cols-[0.9fr_1.1fr] sm:grid-rows-1 sm:rounded-3xl">
        <div className="relative aspect-[4/3] bg-cream-200 sm:aspect-auto sm:min-h-[520px]">
          <Image src={product.image} alt={product.name} fill sizes="(min-width: 640px) 40vw, 100vw" className="object-cover" />
          <div className="absolute left-4 top-4 flex gap-1.5">
            {off > 0 && <Badge tone="maroon">{off}% off</Badge>}
            {product.isNew && <Badge tone="gold">New</Badge>}
          </div>
        </div>

        <div className="overflow-y-auto p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-600">{categoryName(product.category)}</p>
              <h2 id="quickview-title" className="mt-1 font-display text-2xl font-semibold leading-tight text-maroon-900 sm:text-3xl">
                {product.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              autoFocus
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream-100 text-ink-700 transition hover:bg-gold-100"
              aria-label="Close"
            >
              <Icon.X className="h-5 w-5" />
            </button>
          </div>

          <Stars rating={product.rating} count={product.ratingCount} size="md" className="mt-3" />

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-maroon-800">{formatINR(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-base text-ink-500 line-through">{formatINR(product.mrp)}</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">Save {formatINR(product.mrp - product.price)}</span>
              </>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-500">{product.description}</p>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {product.fabric && (
              <div className="rounded-2xl bg-cream-100 p-3">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">Fabric</dt>
                <dd className="mt-1 font-medium text-ink-900">{product.fabric}</dd>
              </div>
            )}
            {product.occasion && (
              <div className="rounded-2xl bg-cream-100 p-3">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">Occasion</dt>
                <dd className="mt-1 font-medium text-ink-900">{product.occasion}</dd>
              </div>
            )}
          </dl>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Size</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={cn(
                    "h-10 min-w-12 rounded-full border px-4 text-sm font-semibold transition",
                    size === s
                      ? "border-maroon-700 bg-maroon-700 text-white"
                      : "border-gold-300 text-ink-700 hover:border-maroon-400",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex h-12 items-center rounded-full border border-gold-300 bg-white">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center rounded-full hover:bg-gold-100" aria-label="Decrease quantity">
                <Icon.Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(10, q + 1))} className="grid h-12 w-12 place-items-center rounded-full hover:bg-gold-100" aria-label="Increase quantity">
                <Icon.Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className={cn(
                "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-white transition",
                added ? "bg-emerald-600" : "bg-maroon-700 hover:bg-maroon-800 active:scale-[0.98]",
              )}
            >
              {added ? <><Icon.Check className="h-4 w-4" /> Added to bag</> : <><Icon.Bag className="h-4 w-4" /> Add to Cart</>}
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                handleAdd();
                onClose();
                openCart();
              }}
              className="inline-flex h-11 items-center justify-center rounded-full border border-maroon-200 text-sm font-semibold text-maroon-800 transition hover:bg-maroon-50"
            >
              Buy now
            </button>
            <a
              href={whatsappLink(`Namaste! I'm interested in "${product.name}" (${formatINR(product.price)}). Is it available in size ${size}?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#25D366]/10 text-sm font-semibold text-[#128C7E] transition hover:bg-[#25D366]/20"
            >
              <Icon.WhatsApp className="h-4 w-4" /> Ask on WhatsApp
            </a>
          </div>

          <Link href={`/product/${product.slug}`} onClick={onClose} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-maroon-700 hover:underline">
            View full details <Icon.ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-[11px] text-ink-500">Sample listing shown for website preview. Final designs, sizes and prices are confirmed at the store.</p>
        </div>
      </div>
    </div>
  );
}
