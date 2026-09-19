import Image from "next/image";
import Link from "next/link";
import { BUSINESS } from "@/data/business";
import { Icon } from "./ui";

const tickerItems = [
  "Lehenga",
  "Gown",
  "Sarees",
  "Women's Fashion",
  "Men's Fashion",
  "Kids Wear",
  "Ethnic Wear",
  "Accessories",
  "Festival Collection",
  "New Arrivals",
];

export function Hero() {
  return (
    <section className="paisley-bg relative overflow-hidden">
      {/* decorative rings */}
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full border border-gold-300/40" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full border border-maroon-200/50" aria-hidden="true" />
      <div className="glow-gold pointer-events-none absolute -right-24 bottom-0 h-[26rem] w-[26rem] rounded-full" aria-hidden="true" />

      <div className="container-x relative grid items-center gap-10 py-12 md:py-16 lg:min-h-[calc(100vh-116px)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-10">
        {/* Copy */}
        <div className="max-w-xl">
          <p
            className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-gold-300 bg-white/85 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-maroon-800"
            style={{ animationDelay: "40ms" }}
          >
            <Icon.MapPin className="h-3.5 w-3.5 text-gold-600" />
            Ram Nagar &amp; Main Road, Nawada
          </p>
          <h1
            className="animate-fade-up mt-6 font-display text-[2.75rem] font-bold leading-[1.02] tracking-tight text-maroon-900 sm:text-6xl lg:text-[4.5rem]"
            style={{ animationDelay: "120ms" }}
          >
            Rajgharana
            <br />
            <span className="gold-text">Mega Mart</span>
          </h1>
          <h2
            className="animate-fade-up mt-5 font-display text-xl font-medium italic text-maroon-700 sm:text-2xl"
            style={{ animationDelay: "200ms" }}
          >
            {BUSINESS.taglineDisplay}
          </h2>
          <p
            className="animate-fade-up mt-4 max-w-md text-base leading-relaxed text-ink-500 sm:text-lg"
            style={{ animationDelay: "280ms" }}
          >
            Discover fashion, tradition and style for the entire family — all under one roof.
          </p>

          <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "360ms" }}>
            <Link
              href="/shop"
              className="group inline-flex h-13 items-center gap-2 rounded-full bg-maroon-700 px-7 text-sm font-bold uppercase tracking-wider text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-maroon-800 hover:shadow-card"
            >
              Shop Now
              <Icon.ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/#categories"
              className="inline-flex h-13 items-center gap-2 rounded-full border-2 border-gold-500 bg-white/80 px-7 text-sm font-bold uppercase tracking-wider text-maroon-800 transition hover:-translate-y-0.5 hover:bg-gold-100"
            >
              Explore Collection
            </Link>
          </div>

          <dl className="animate-fade-up mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-gold-300/60 pt-6" style={{ animationDelay: "440ms" }}>
            {[
              ["2", "Store locations in Nawada"],
              ["10", "Fashion categories"],
              ["Family", "Women · Men · Kids"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-2xl font-bold text-maroon-900 sm:text-3xl">{value}</dt>
                <dd className="mt-1 text-[11px] font-medium uppercase tracking-wider text-ink-500 sm:text-xs">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="animate-fade-up relative" style={{ animationDelay: "200ms" }}>
            <div className="absolute -inset-3 rounded-t-[12rem] rounded-b-[2rem] border border-gold-300/70" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[12rem] rounded-b-[2rem] shadow-card ring-1 ring-gold-200">
              <Image
                src="/images/hero.jpg"
                alt="Elegant bridal lehenga from Rajgharana Mega Mart, Nawada"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, (min-width: 640px) 60vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-maroon-950/60 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-cream-50">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-300">Bridal Edit</p>
                  <p className="font-display text-xl font-semibold">Lehenga &amp; Sarees</p>
                </div>
                <Link
                  href="/shop?category=lehenga"
                  className="grid h-11 w-11 place-items-center rounded-full bg-white/20 transition hover:bg-gold-400 hover:text-maroon-950"
                  aria-label="Explore lehengas"
                >
                  <Icon.ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* floating badges */}
            <div className="animate-float absolute -left-4 top-24 hidden rounded-2xl border border-gold-200 bg-white/95 px-4 py-3 shadow-soft will-change-transform sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">Festival</p>
              <p className="font-display text-lg font-semibold text-maroon-900">Collection</p>
            </div>
            <div
              className="animate-float absolute -right-3 bottom-28 hidden items-center gap-3 rounded-2xl border border-gold-200 bg-white/95 px-4 py-3 shadow-soft will-change-transform sm:flex"
              style={{ animationDelay: "1.5s" }}
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-maroon-700 text-white">
                <Icon.Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-600">New Arrivals</p>
                <p className="text-sm font-semibold text-maroon-900">Fresh styles weekly</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ticker */}
      <div className="relative border-y border-gold-200/70 bg-maroon-800 py-3 text-cream-100">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap px-5 text-xs font-semibold uppercase tracking-[0.28em] will-change-transform">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-10">
              {item}
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
