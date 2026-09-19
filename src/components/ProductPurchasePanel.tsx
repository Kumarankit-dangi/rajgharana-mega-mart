"use client";

import { useState } from "react";
import type { Product } from "@/db/schema";
import { BUSINESS, TEL_LINK, whatsappLink } from "@/data/business";
import { useCart } from "@/lib/cart-context";
import { cn, formatINR } from "@/lib/utils";
import { Icon } from "./ui";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { add, openCart } = useCart();
  const [size, setSize] = useState(product.sizes[0] ?? "Free Size");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

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
    <div className="mt-6 space-y-5">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Select size</p>
          <span className="text-xs text-ink-500">Need help? Call {BUSINESS.phone}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              aria-pressed={size === s}
              className={cn(
                "h-11 min-w-12 rounded-full border px-4 text-sm font-semibold transition",
                size === s ? "border-maroon-700 bg-maroon-700 text-white" : "border-gold-300 text-ink-700 hover:border-maroon-400",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
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
            "inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-white shadow-soft transition",
            added ? "bg-emerald-600" : "bg-maroon-700 hover:bg-maroon-800 active:scale-[0.98]",
          )}
        >
          {added ? <><Icon.Check className="h-4 w-4" /> Added to bag</> : <><Icon.Bag className="h-4 w-4" /> Add to Cart</>}
        </button>
        <button
          type="button"
          onClick={() => {
            handleAdd();
            openCart();
          }}
          className="inline-flex h-12 items-center justify-center rounded-full border-2 border-gold-500 px-6 text-sm font-bold text-maroon-800 transition hover:bg-gold-100"
        >
          Buy now
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <a
          href={whatsappLink(`Namaste! I'm interested in "${product.name}" (${formatINR(product.price)}), size ${size}, qty ${qty}. Is it available?`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-bold text-white transition hover:brightness-95"
        >
          <Icon.WhatsApp className="h-5 w-5" /> Ask on WhatsApp
        </a>
        <a href={TEL_LINK} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-maroon-200 text-sm font-semibold text-maroon-800 transition hover:bg-maroon-50">
          <Icon.Phone className="h-4 w-4" /> Call {BUSINESS.phone}
        </a>
      </div>
    </div>
  );
}
