import type { Product } from "@/db/schema";
import { productMatchesCategory } from "@/data/categories";

/** Pure, client-safe product filtering & sorting (no database imports). */
export function filterProducts(
  list: Product[],
  options: { q?: string; category?: string; sort?: string },
): Product[] {
  const q = options.q?.trim().toLowerCase();
  let result = list.filter((p) => productMatchesCategory(p, options.category));
  if (q) {
    result = result.filter((p) =>
      [p.name, p.category, p.fabric ?? "", p.occasion ?? "", p.description]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }
  switch (options.sort) {
    case "price-asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "discount":
      result = [...result].sort(
        (a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp,
      );
      break;
    case "newest":
      result = [...result].sort(
        (a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id,
      );
      break;
    default:
      break;
  }
  return result;
}
