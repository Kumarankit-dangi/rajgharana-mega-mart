"use client";

import { useCallback, useState } from "react";
import type { Product } from "@/db/schema";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";
import { QuickViewModal } from "./QuickViewModal";
import { Reveal } from "./Reveal";

export function ProductGrid({
  products,
  className,
  columns = 4,
  priorityCount = 0,
}: {
  products: Product[];
  className?: string;
  columns?: 3 | 4;
  priorityCount?: number;
}) {
  const [quick, setQuick] = useState<Product | null>(null);
  const close = useCallback(() => setQuick(null), []);

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-2 gap-3 sm:gap-5",
          columns === 4 ? "md:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-3",
          className,
        )}
      >
        {products.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 60} className="h-full">
            <ProductCard product={p} onQuickView={setQuick} priority={i < priorityCount} />
          </Reveal>
        ))}
      </div>
      <QuickViewModal product={quick} onClose={close} />
    </>
  );
}
