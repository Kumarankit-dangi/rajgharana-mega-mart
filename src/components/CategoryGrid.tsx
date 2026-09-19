import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/data/categories";
import { cn } from "@/lib/utils";
import { Icon } from "./ui";
import { Reveal } from "./Reveal";

export function CategoryCard({
  category,
  count,
  index = 0,
  tall = false,
}: {
  category: Category;
  count?: number;
  index?: number;
  tall?: boolean;
}) {
  return (
    <Reveal delay={index * 70} className="h-full">
      <Link
        href={`/shop?category=${category.slug}`}
        className={cn(
          "group relative block h-full overflow-hidden rounded-3xl bg-cream-200 shadow-soft ring-1 ring-gold-200/60 transition duration-500 hover:-translate-y-1 hover:shadow-card",
          tall ? "aspect-[3/4]" : "aspect-[4/5]",
        )}
      >
        <Image
          src={category.image}
          alt={`${category.name} collection at Rajgharana Mega Mart`}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/85 via-maroon-950/20 to-transparent transition duration-500 group-hover:from-maroon-950/90" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          {typeof count === "number" && (
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-300">
              {count} {count === 1 ? "style" : "styles"}
            </p>
          )}
          <h3 className="font-display text-xl font-semibold text-cream-50 sm:text-2xl">{category.cardName}</h3>
          <span className="mt-3 inline-flex h-9 items-center gap-2 rounded-full bg-white/20 px-4 text-xs font-bold uppercase tracking-wider text-cream-50 transition duration-300 group-hover:bg-gold-400 group-hover:text-maroon-950">
            Explore
            <Icon.ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
        <span className="absolute right-4 top-4 h-8 w-8 rounded-full border border-white/40 opacity-0 transition duration-500 group-hover:scale-125 group-hover:opacity-100" />
      </Link>
    </Reveal>
  );
}

export function CategoryGrid({
  categories,
  counts,
}: {
  categories: Category[];
  counts?: Record<string, number>;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-6">
      {categories.map((c, i) => (
        <CategoryCard key={c.slug} category={c} index={i} count={counts?.[c.slug]} />
      ))}
    </div>
  );
}
