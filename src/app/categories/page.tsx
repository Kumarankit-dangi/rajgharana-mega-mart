import type { Metadata } from "next";
import { CategoryCard } from "@/components/CategoryGrid";
import { SectionHeading } from "@/components/ui";
import { CATEGORIES, productMatchesCategory } from "@/data/categories";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Explore all categories at Rajgharana Mega Mart - Nawada: Lehenga, Gown, Sarees, Women's Fashion, Men's Fashion, Kids Wear, Ethnic Wear, Accessories, Festival Collection and New Arrivals.",
};

export default async function CategoriesPage() {
  const all = await getAllProducts();
  return (
    <div className="py-14 sm:py-20">
      <div className="container-x">
        <SectionHeading
          eyebrow="Categories"
          title="Ten ways to shop the family wardrobe"
          description="Every category at Rajgharana Mega Mart, from bridal lehengas to the accessories that finish the look."
        />
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-5">
          {CATEGORIES.map((c, i) => (
            <CategoryCard
              key={c.slug}
              category={c}
              index={i}
              tall
              count={all.filter((p) => productMatchesCategory(p, c.slug)).length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
