import type { Product } from "@/db/schema";

export type Category = {
  slug: string;
  name: string;
  /** Shorter label used on the home category cards */
  cardName: string;
  description: string;
  image: string;
  /** Virtual categories are driven by product flags instead of the category column */
  virtual?: "new" | "festive";
};

const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800`;

export const CATEGORIES: Category[] = [
  {
    slug: "lehenga",
    name: "Lehenga",
    cardName: "Lehenga",
    description: "Bridal, festive and party lehengas with rich zari and mirror work.",
    image: "/images/cat-lehenga.jpg",
  },
  {
    slug: "gown",
    name: "Gown",
    cardName: "Gown",
    description: "Evening gowns, reception gowns and indo-western silhouettes.",
    image: "/images/cat-gown.jpg",
  },
  {
    slug: "sarees",
    name: "Sarees",
    cardName: "Sarees",
    description: "Banarasi, silk, georgette and everyday sarees for every occasion.",
    image: "/images/cat-saree.jpg",
  },
  {
    slug: "womens-fashion",
    name: "Women's Fashion",
    cardName: "Women's Wear",
    description: "Kurtis, anarkalis, suits and fusion wear for the modern woman.",
    image: "/images/cat-women.jpg",
  },
  {
    slug: "mens-fashion",
    name: "Men's Fashion",
    cardName: "Men's Wear",
    description: "Sherwanis, kurta sets, Nehru jackets and smart casuals.",
    image: "/images/cat-men.jpg",
  },
  {
    slug: "kids-wear",
    name: "Kids Wear",
    cardName: "Kids Wear",
    description: "Festive and everyday wear for little princes and princesses.",
    image: "/images/cat-kids.jpg",
  },
  {
    slug: "ethnic-wear",
    name: "Ethnic Wear",
    cardName: "Ethnic Wear",
    description: "Traditional ensembles that celebrate Indian craftsmanship.",
    image: px(15455512),
  },
  {
    slug: "accessories",
    name: "Accessories",
    cardName: "Accessories",
    description: "Jewellery, juttis, clutches and finishing touches.",
    image: px(35059564),
  },
  {
    slug: "festival-collection",
    name: "Festival Collection",
    cardName: "Festival Collection",
    description: "Curated picks for Diwali, Chhath, Holi, Eid and wedding season.",
    image: px(19119323),
    virtual: "festive",
  },
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    cardName: "New Arrivals",
    description: "Fresh styles landing in store every week.",
    image: px(38720214),
    virtual: "new",
  },
];

export const HOME_CATEGORIES = CATEGORIES.slice(0, 6);

export function getCategory(slug: string | undefined | null) {
  if (!slug) return undefined;
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categoryName(slug: string) {
  return getCategory(slug)?.name ?? slug;
}

export function productMatchesCategory(
  product: Pick<Product, "category" | "isNew" | "isFestive">,
  slug: string | undefined | null,
) {
  if (!slug || slug === "all") return true;
  const cat = getCategory(slug);
  if (cat?.virtual === "new") return product.isNew;
  if (cat?.virtual === "festive") return product.isFestive;
  return product.category === slug;
}

export function sizesForCategory(category: string): string[] {
  switch (category) {
    case "sarees":
    case "accessories":
      return ["Free Size"];
    case "kids-wear":
      return ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"];
    default:
      return ["S", "M", "L", "XL", "XXL"];
  }
}
