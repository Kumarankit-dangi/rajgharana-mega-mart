import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { BUSINESS } from "@/data/business";
import { CartProvider } from "@/lib/cart-context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${BUSINESS.name} | ${BUSINESS.taglineDisplay}`,
    template: `%s | ${BUSINESS.shortName}`,
  },
  description:
    "Rajgharana Mega Mart - Nawada is Nawada's biggest family shopping destination for lehenga, gown, sarees, women's & men's fashion, kids wear, ethnic wear and accessories. Ram Nagar & Main Road, Nawada. Call 9263240609.",
  keywords: [
    "Rajgharana Mega Mart",
    "Nawada shopping",
    "lehenga Nawada",
    "saree shop Nawada",
    "family fashion store Bihar",
    "kids wear Nawada",
    "men's fashion Nawada",
  ],
  applicationName: BUSINESS.shortName,
  icons: { icon: "/logo.svg", apple: "/logo.svg" },
  openGraph: {
    title: `${BUSINESS.name} | ${BUSINESS.taglineDisplay}`,
    description: "Discover fashion, tradition and style for the entire family — all under one roof.",
    type: "website",
    locale: "en_IN",
    siteName: BUSINESS.name,
    images: [{ url: "/images/hero.jpg", width: 1024, height: 1280, alt: BUSINESS.name }],
  },
};

export const viewport: Viewport = {
  themeColor: "#6f121b",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: BUSINESS.name,
  slogan: BUSINESS.tagline,
  telephone: `+${BUSINESS.phoneIntl}`,
  image: "/images/hero.jpg",
  logo: "/logo.svg",
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "Ram Nagar",
      addressLocality: "Nawada",
      addressRegion: "Bihar",
      postalCode: BUSINESS.pincode,
      addressCountry: "IN",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "Main Road",
      addressLocality: "Nawada",
      addressRegion: "Bihar",
      addressCountry: "IN",
    },
  ],
  sameAs: [BUSINESS.instagramUrl],
  parentOrganization: { "@type": "Organization", name: BUSINESS.managedBy },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Rozha+One&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-cream-50 text-ink-900 antialiased">
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-maroon-700 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  );
}
