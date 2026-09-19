"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/db/schema";
import { categoryName } from "@/data/categories";
import { useCart } from "@/lib/cart-context";
import { cn, discountPercent, formatINR } from "@/lib/utils";
import { Badge, Icon, Stars } from "./ui";

export function ProductCard({
  product,
  onQuickView,
  priority = false,
}: {
  product: Product;
  onQuickView: (product: Product) => void;
  priority?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const off = discountPercent(product.price, product.mrp);

  const handleAdd = () => {
    add({
      slug: product.slug,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      image: product.image,
      size: product.sizes[0] ?? "Free Size",
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-gold-200/50 transition duration-500 hover:-translate-y-1 hover:shadow-card">
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-200">
        <Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-105"
          />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {off > 0 && <Badge tone="maroon">{off}% off</Badge>}
          {product.isNew && <Badge tone="gold">New</Badge>}
          {product.isFestive && !product.isNew && <Badge tone="cream">Festive</Badge>}
        </div>
        <button
          type="button"
          onClick={() => onQuickView(product)}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-maroon-800 shadow-sm transition hover:bg-maroon-700 hover:text-white pointer-fine:translate-y-2 pointer-fine:opacity-0 pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100"
          aria-label={`Quick view ${product.name}`}
        >
          <Icon.Eye className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => onQuickView(product)}
          className="absolute inset-x-4 bottom-4 hidden h-11 items-center justify-center gap-2 rounded-full bg-white/95 text-sm font-semibold text-maroon-900 shadow-soft transition duration-300 hover:bg-gold-400 pointer-fine:flex pointer-fine:translate-y-3 pointer-fine:opacity-0 pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100"
        >
          <Icon.Eye className="h-4 w-4" /> Quick View
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-600">{categoryName(product.category)}</p>
        <h3 className="mt-1 line-clamp-2 font-display text-base font-semibold leading-snug text-ink-900 sm:text-lg">
          <Link href={`/product/${product.slug}`} className="transition hover:text-maroon-700">
            {product.name}
          </Link>
        </h3>
        <Stars rating={product.rating} count={product.ratingCount} className="mt-2" />
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-maroon-800">{formatINR(product.price)}</span>
          {product.mrp > product.price && (
            <span className="text-sm text-ink-500 line-through">{formatINR(product.mrp)}</span>
          )}
        </div>
        <div className="mt-auto flex gap-2 pt-4">
          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold transition duration-300",
              added
                ? "bg-emerald-600 text-white"
                : "bg-maroon-700 text-white hover:bg-maroon-800 active:scale-[0.98]",
            )}
          >
            {added ? (
              <>
                <Icon.Check className="h-4 w-4" /> Added
              </>
            ) : (
              <>
                <Icon.Bag className="h-4 w-4" /> Add to Cart
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold-300 text-maroon-800 transition hover:bg-gold-100 pointer-fine:hidden"
            aria-label={`Quick view ${product.name}`}
          >
            <Icon.Eye className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
