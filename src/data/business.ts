/**
 * Exact business details for Rajgharana Mega Mart - Nawada.
 * Do not change spelling, phone number or addresses.
 */
export const BUSINESS = {
  name: "Rajgharana Mega Mart - Nawada",
  shortName: "Rajgharana Mega Mart",
  hindiName: "राजघराना",
  hindiSub: "मेगा मार्ट",
  tagline: "Nawada Biggest Family Shopping Destination",
  taglineDisplay: "Nawada's Biggest Family Shopping Destination",
  phone: "9263240609",
  phoneIntl: "919263240609",
  locations: ["Ram Nagar, Nawada", "Main Road, Nawada"],
  fullAddress: "Ram Nagar Nawada, Bihar Sharif 805110",
  city: "Nawada",
  state: "Bihar",
  pincode: "805110",
  managedBy: "Business Tarakki",
  instagramHandle: "rajgharana_mega_mart_nawada",
  instagramUrl: "https://www.instagram.com/rajgharana_mega_mart_nawada",
} as const;

export const TEL_LINK = `tel:+${BUSINESS.phoneIntl}`;

export function whatsappLink(message?: string) {
  const text =
    message ??
    `Namaste Rajgharana Mega Mart! I would like to know more about your collection.`;
  return `https://wa.me/${BUSINESS.phoneIntl}?text=${encodeURIComponent(text)}`;
}

const DESTINATION = "Rajgharana Mega Mart, Ram Nagar, Nawada, Bihar 805110";

export const DIRECTIONS_LINK = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  DESTINATION,
)}`;

export const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  DESTINATION,
)}&output=embed`;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
