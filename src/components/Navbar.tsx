"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BUSINESS, NAV_LINKS, TEL_LINK, whatsappLink } from "@/data/business";
import { HOME_CATEGORIES } from "@/data/categories";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";
import { Logo, LogoEmblem } from "./Logo";
import { Icon } from "./ui";
import { SearchOverlay } from "./SearchOverlay";
import { CartDrawer } from "./CartDrawer";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/shop" && pathname.startsWith("/product")) return true;
  return pathname.startsWith(href);
}

/** All page links, always visible on phones & tablets (below the main header row). */
function MobileNavStrip({ pathname }: { pathname: string }) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (list.scrollWidth <= list.clientWidth) return;
    const active = list.querySelector<HTMLLIElement>('li[data-active="true"]');
    if (!active) return;
    const left = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [pathname]);

  return (
    <nav aria-label="Pages" className="border-t border-gold-200/60 lg:hidden">
      <ul
        ref={listRef}
        className="no-scrollbar relative flex items-stretch justify-between gap-4 overflow-x-auto px-4 sm:gap-8 sm:px-6"
      >
        {NAV_LINKS.map((link) => {
          const active = isActivePath(pathname, link.href);
          return (
            <li key={link.href} data-active={active ? "true" : "false"} className="shrink-0">
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-10 items-center whitespace-nowrap text-[11px] font-semibold transition-colors min-[390px]:text-xs sm:text-sm",
                  active ? "text-maroon-800" : "text-ink-700 active:text-maroon-700",
                )}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gold-500 transition-transform duration-300",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { count, openCart, hydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const iconBtn =
    "grid h-10 w-10 place-items-center rounded-full text-ink-700 transition-colors hover:bg-gold-100 hover:text-maroon-800 active:bg-gold-100 sm:h-11 sm:w-11";

  return (
    <>
      {/* Announcement bar — scrolls away so the sticky header stays compact on phones */}
      <div className="bg-maroon-800 text-cream-100">
        <div className="container-x flex h-9 items-center justify-between gap-4 text-[11px] font-medium tracking-wide sm:text-xs">
          <p className="hidden items-center gap-2 md:inline-flex">
            <Icon.MapPin className="h-3.5 w-3.5 text-gold-300" />
            Ram Nagar, Nawada &nbsp;·&nbsp; Main Road, Nawada
          </p>
          <p className="mx-auto truncate text-center text-gold-200 md:mx-0">{BUSINESS.taglineDisplay}</p>
          <a href={TEL_LINK} className="hidden items-center gap-2 transition hover:text-gold-200 md:inline-flex">
            <Icon.Phone className="h-3.5 w-3.5 text-gold-300" />
            {BUSINESS.phone}
          </a>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b border-gold-200/60 transition-[background-color,box-shadow] duration-300",
          scrolled
            ? "bg-white shadow-[0_8px_30px_-16px_rgba(79,12,19,0.35)] lg:bg-white/90 lg:backdrop-blur-md"
            : "bg-cream-50",
        )}
      >
        <nav aria-label="Primary" className="container-x flex h-16 items-center justify-between gap-2 md:h-20 md:gap-3">
          <Link href="/" className="min-w-0 shrink rounded-lg" aria-label={`${BUSINESS.name} – Home`}>
            <Logo compact />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative rounded-full px-4 py-2 text-sm font-semibold tracking-wide transition-colors",
                      active ? "text-maroon-800" : "text-ink-700 hover:text-maroon-700",
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded-full bg-gold-500 transition-transform duration-300",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
            <button type="button" onClick={() => setSearchOpen(true)} className={iconBtn} aria-label="Search products">
              <Icon.Search className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
            </button>
            <a
              href={TEL_LINK}
              className="hidden h-11 items-center gap-2 rounded-full border border-maroon-200 px-4 text-sm font-semibold text-maroon-800 transition hover:border-maroon-700 hover:bg-maroon-700 hover:text-white md:inline-flex"
            >
              <Icon.Phone className="h-4 w-4" />
              Call
            </a>
            <button
              type="button"
              onClick={openCart}
              className={cn(iconBtn, "relative")}
              aria-label={`Open shopping bag${hydrated && count ? `, ${count} items` : ""}`}
            >
              <Icon.Bag className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
              {hydrated && count > 0 && (
                <span className="animate-pop absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-maroon-700 px-1 text-[11px] font-bold text-white ring-2 ring-cream-50">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={cn(iconBtn, "lg:hidden")}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Icon.Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>

        <MobileNavStrip pathname={pathname} />
      </header>

      {/* Mobile menu (categories, game, contact shortcuts) */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn(
          "fixed inset-0 z-[60] flex flex-col bg-cream-50 transition-transform duration-300 ease-out lg:hidden",
          menuOpen ? "translate-x-0" : "pointer-events-none translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gold-200 px-4">
          <Logo compact />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink-700 shadow-sm"
            aria-label="Close menu"
          >
            <Icon.X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-10 pt-6">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-2xl font-semibold transition",
                      active ? "bg-maroon-700 text-white" : "text-maroon-900 hover:bg-gold-100",
                    )}
                  >
                    {link.label}
                    <Icon.ArrowRight className="h-5 w-5 opacity-60" />
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/play"
                className="flex items-center justify-between rounded-2xl bg-gold-100 px-4 py-3.5 font-display text-2xl font-semibold text-maroon-900"
              >
                <span className="flex items-center gap-3">
                  <Icon.Gamepad className="h-6 w-6 text-maroon-700" />
                  Play Festive Catch
                </span>
                <span className="rounded-full bg-maroon-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Game
                </span>
              </Link>
            </li>
          </ul>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">Shop by category</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {HOME_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/shop?category=${c.slug}`}
                className="rounded-full border border-gold-200 bg-white px-3.5 py-2 text-sm font-medium text-ink-700 transition hover:border-maroon-400 hover:text-maroon-800"
              >
                {c.cardName}
              </Link>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <a
              href={TEL_LINK}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-maroon-700 text-sm font-semibold text-white"
            >
              <Icon.Phone className="h-4 w-4" /> Call Now
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-semibold text-white"
            >
              <Icon.WhatsApp className="h-5 w-5" /> WhatsApp
            </a>
          </div>

          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-gold-200 bg-white p-4">
            <LogoEmblem className="h-14 w-14" />
            <div className="text-sm leading-relaxed text-ink-700">
              <p className="font-semibold text-maroon-900">{BUSINESS.name}</p>
              <p>{BUSINESS.locations.join(" · ")}</p>
              <p>Phone: {BUSINESS.phone}</p>
            </div>
          </div>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />
    </>
  );
}
