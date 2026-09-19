import Link from "next/link";
import { BUSINESS, NAV_LINKS, TEL_LINK, whatsappLink } from "@/data/business";
import { CATEGORIES } from "@/data/categories";
import { LogoEmblem } from "./Logo";
import { Icon } from "./ui";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-maroon-950 text-cream-200">
      <div className="gold-line" />
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.2fr] lg:gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-4">
            <LogoEmblem className="h-20 w-20" />
            <div>
              <p className="font-display text-xl font-bold text-cream-50">{BUSINESS.name}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">{BUSINESS.tagline}</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream-200/75">
            Lehenga, gown, sarees, women&apos;s &amp; men&apos;s fashion, kids wear, ethnic collections and accessories —
            the whole family shops together at Rajgharana.
          </p>
          <div className="mt-6 flex items-center gap-2">
            {[
              { href: BUSINESS.instagramUrl, label: "Instagram", icon: Icon.Instagram },
              { href: whatsappLink(), label: "WhatsApp", icon: Icon.WhatsApp },
              { href: "#", label: "Facebook", icon: Icon.Facebook },
              { href: "#", label: "YouTube", icon: Icon.YouTube },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-cream-100 transition hover:border-gold-400 hover:bg-gold-400 hover:text-maroon-950"
              >
                <s.icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <nav aria-label="Quick links">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">Quick Links</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-gold-300">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/play" className="inline-flex items-center gap-2 transition hover:text-gold-300">
                Festive Catch <span className="rounded-full bg-gold-400 px-1.5 py-0.5 text-[9px] font-bold uppercase text-maroon-950">Game</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Categories */}
        <nav aria-label="Categories">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">Categories</p>
          <ul className="mt-5 grid grid-cols-1 gap-2.5 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`} className="transition hover:text-gold-300">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">Contact Information</p>
          <ul className="mt-5 space-y-3 text-sm">
            {BUSINESS.locations.map((loc) => (
              <li key={loc} className="flex items-start gap-3">
                <Icon.MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                <span>{loc}</span>
              </li>
            ))}
            <li className="flex items-start gap-3">
              <Icon.Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <a href={TEL_LINK} className="hover:text-gold-300">
                {BUSINESS.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Icon.Shield className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <span>Managed by {BUSINESS.managedBy}</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon.MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <span>{BUSINESS.fullAddress}</span>
            </li>
          </ul>
          <div className="mt-5 flex gap-2">
            <a href={TEL_LINK} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-gold-400 text-xs font-bold uppercase tracking-wider text-maroon-950 transition hover:bg-gold-300">
              <Icon.Phone className="h-4 w-4" /> Call
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] text-xs font-bold uppercase tracking-wider text-white transition hover:brightness-95"
            >
              <Icon.WhatsApp className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-center text-xs text-cream-200/60 sm:flex-row sm:text-left">
          <p>
            © {year} {BUSINESS.name}. All rights reserved.
          </p>
          <p>
            Managed by {BUSINESS.managedBy} · Product listings on this site are sample/demo items.
          </p>
        </div>
      </div>
    </footer>
  );
}
