import type { Metadata } from "next";
import { ShopClient } from "@/components/ShopClient";
import { Icon } from "@/components/ui";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "Fresh styles just landed at Rajgharana Mega Mart - Nawada. Discover the newest lehengas, sarees, kurtas and kids wear.",
};

export default async function NewArrivalsPage() {
  const products = await getAllProducts();
  return (
    <div className="pb-20">
      <section className="relative overflow-hidden border-b border-gold-200/60 bg-maroon-900 text-cream-50">
        <div className="dots-bg pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="container-x relative py-12 sm:py-16">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold-300">
            <Icon.Sparkles className="h-4 w-4" /> Just landed
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">New Arrivals</h1>
          <p className="mt-3 max-w-xl text-cream-200/80">
            The latest styles to reach our racks in Nawada. New pieces arrive regularly — follow us on Instagram to catch them first.
          </p>
        </div>
      </section>
      <div className="container-x">
        <ShopClient products={products} lockedCategory="new-arrivals" />
      </div>
    </div>
  );
}
