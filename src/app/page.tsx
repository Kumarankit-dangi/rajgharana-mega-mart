import Link from "next/link";
import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductGrid } from "@/components/ProductGrid";
import { Highlights } from "@/components/Highlights";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { GameTeaser } from "@/components/GameTeaser";
import { Icon, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { HOME_CATEGORIES, productMatchesCategory } from "@/data/categories";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const all = await getAllProducts();
  const featured = [...all.filter((p) => p.isFeatured), ...all.filter((p) => !p.isFeatured)].slice(0, 8);
  const counts = Object.fromEntries(
    HOME_CATEGORIES.map((c) => [c.slug, all.filter((p) => productMatchesCategory(p, c.slug)).length]),
  );

  return (
    <>
      <Hero />

      {/* Categories */}
      <section id="categories" className="py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Shop by category"
            title="Curated collections for every member of the family"
            description="From bridal lehengas to everyday kurtas — explore what Nawada's biggest family store has in store for you."
          />
          <div className="mt-12">
            <CategoryGrid categories={HOME_CATEGORIES} counts={counts} />
          </div>
          <div className="mt-8 text-center">
            <Link href="/categories" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-maroon-800 hover:text-maroon-600">
              View all 10 categories <Icon.ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-cream-100 py-16 sm:py-24">
        <div className="container-x">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              align="left"
              eyebrow="Featured picks"
              title="Trending at Rajgharana"
              description="Hand-picked styles our customers keep asking for."
            />
            <Link
              href="/shop"
              className="inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full border-2 border-maroon-700 px-6 text-sm font-bold uppercase tracking-wider text-maroon-800 transition hover:bg-maroon-700 hover:text-white md:self-auto"
            >
              View all products <Icon.ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <Reveal className="mt-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-gold-200 bg-white px-4 py-2 text-xs font-medium text-ink-500">
              <Icon.Tag className="h-4 w-4 text-gold-600" />
              Sample catalogue — demo products shown for website preview. Visit the store or WhatsApp us for the live collection and prices.
            </p>
          </Reveal>
          <div className="mt-8">
            <ProductGrid products={featured} priorityCount={4} />
          </div>
        </div>
      </section>

      <Highlights />
      <AboutSection />
      <GameTeaser />
      <ContactSection />
    </>
  );
}
