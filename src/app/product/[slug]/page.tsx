import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { Badge, Icon, Stars } from "@/components/ui";
import { categoryName } from "@/data/categories";
import { getAllProducts, getProductBySlug } from "@/lib/products";
import { discountPercent, formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: `${product.name} – ${categoryName(product.category)} at Rajgharana Mega Mart - Nawada. ${formatINR(product.price)}.`,
    openGraph: { images: [{ url: product.image, alt: product.name }] },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await getAllProducts();
  const related = all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const off = discountPercent(product.price, product.mrp);

  return (
    <div className="pb-20">
      <div className="container-x pt-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-medium text-ink-500">
          <Link href="/" className="hover:text-maroon-700">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-maroon-700">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-maroon-700">{categoryName(product.category)}</Link>
          <span>/</span>
          <span className="text-ink-900">{product.name}</span>
        </nav>
      </div>

      <section className="container-x mt-6 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] lg:sticky lg:top-[calc(var(--header-h)+1rem)] bg-cream-200 shadow-card ring-1 ring-gold-200">
            <div className="relative aspect-[3/4]">
              <Image src={product.image} alt={product.name} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute left-4 top-4 flex gap-1.5">
                {off > 0 && <Badge tone="maroon">{off}% off</Badge>}
                {product.isNew && <Badge tone="gold">New</Badge>}
                {product.isFestive && <Badge tone="cream">Festive</Badge>}
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">{categoryName(product.category)}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-maroon-900 sm:text-4xl lg:text-5xl">{product.name}</h1>
          <Stars rating={product.rating} count={product.ratingCount} size="md" className="mt-4" />

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-bold text-maroon-800">{formatINR(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-lg text-ink-500 line-through">{formatINR(product.mrp)}</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">You save {formatINR(product.mrp - product.price)}</span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-ink-500">Inclusive of all taxes · Sample listing price</p>

          <p className="mt-6 text-base leading-relaxed text-ink-500">{product.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            {[
              ["Fabric", product.fabric],
              ["Occasion", product.occasion],
              ["Category", categoryName(product.category)],
            ]
              .filter(([, v]) => !!v)
              .map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-gold-200 bg-white p-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-600">{k}</dt>
                  <dd className="mt-1 font-medium text-ink-900">{v}</dd>
                </div>
              ))}
          </dl>

          <ProductPurchasePanel product={product} />

          <ul className="mt-8 grid gap-3 border-t border-gold-200 pt-6 text-sm text-ink-700 sm:grid-cols-3">
            {[
              [Icon.Shield, "Quality checked"],
              [Icon.MapPin, "Try in store at Nawada"],
              [Icon.WhatsApp, "Confirm on WhatsApp"],
            ].map(([I, label]) => {
              const IconComponent = I as typeof Icon.Shield;
              return (
                <li key={label as string} className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gold-100 text-maroon-700">
                    <IconComponent className="h-4 w-4" />
                  </span>
                  {label as string}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x mt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">You may also like</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-maroon-900">More {categoryName(product.category)}</h2>
            </div>
            <Link href={`/shop?category=${product.category}`} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-maroon-800 hover:text-maroon-600">
              View all <Icon.ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
