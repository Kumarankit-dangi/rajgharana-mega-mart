"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { BUSINESS, TEL_LINK, whatsappLink } from "@/data/business";
import { useCart } from "@/lib/cart-context";
import { cn, formatINR } from "@/lib/utils";
import { Icon } from "./ui";

export function CartDrawer() {
  const { items, count, subtotal, savings, isOpen, closeCart, setQty, remove, clear } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  const orderMessage = () => {
    const lines = items.map(
      (i, idx) =>
        `${idx + 1}. ${i.name} (Size: ${i.size}) × ${i.qty} – ${formatINR(i.price * i.qty)}`,
    );
    return [
      `Namaste ${BUSINESS.shortName}! I'd like to order:`,
      "",
      ...lines,
      "",
      `Subtotal: ${formatINR(subtotal)}`,
      "Please confirm availability and pickup/delivery details.",
    ].join("\n");
  };

  return (
    <div
      className={cn("fixed inset-0 z-[80] transition", isOpen ? "" : "pointer-events-none")}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label="Close bag"
        onClick={closeCart}
        tabIndex={isOpen ? 0 : -1}
        className={cn(
          "absolute inset-0 bg-maroon-950/65 transition-opacity duration-300 lg:backdrop-blur-sm",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream-50 shadow-card transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-gold-200 px-5 py-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-maroon-900">Your Bag</h2>
            <p className="text-xs text-ink-500">{count} {count === 1 ? "item" : "items"}</p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink-700 shadow-sm hover:bg-gold-100"
            aria-label="Close bag"
          >
            <Icon.X className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-gold-100 text-maroon-700">
              <Icon.Bag className="h-9 w-9" />
            </span>
            <p className="mt-5 font-display text-xl font-semibold text-maroon-900">Your bag is empty</p>
            <p className="mt-2 text-sm text-ink-500">
              Add your favourite lehengas, sarees, kurtas and more — then send the order to us on WhatsApp.
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-maroon-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-maroon-800"
            >
              Start Shopping <Icon.ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-cream-200 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-4">
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={closeCart}
                    className="relative h-24 w-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-cream-200"
                  >
                    <Image src={item.image} alt={item.name} fill sizes="72px" className="object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink-900">{item.name}</p>
                        <p className="text-xs text-ink-500">Size: {item.size}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.key)}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-500 transition hover:bg-maroon-50 hover:text-maroon-700"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Icon.Trash className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-gold-200 bg-white">
                        <button
                          type="button"
                          onClick={() => setQty(item.key, item.qty - 1)}
                          className="grid h-8 w-8 place-items-center rounded-full text-ink-700 hover:bg-gold-100"
                          aria-label="Decrease quantity"
                        >
                          <Icon.Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(item.key, item.qty + 1)}
                          className="grid h-8 w-8 place-items-center rounded-full text-ink-700 hover:bg-gold-100"
                          aria-label="Increase quantity"
                        >
                          <Icon.Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-maroon-800">{formatINR(item.price * item.qty)}</p>
                        {item.mrp > item.price && (
                          <p className="text-[11px] text-ink-500 line-through">{formatINR(item.mrp * item.qty)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-gold-200 bg-white px-5 py-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-ink-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatINR(subtotal)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>You save</span>
                    <span className="font-semibold">{formatINR(savings)}</span>
                  </div>
                )}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-ink-500">
                No online payment needed. Send your bag to us on WhatsApp — our team confirms availability, size and pickup at the store.
              </p>
              <a
                href={whatsappLink(orderMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-bold text-white transition hover:brightness-95"
              >
                <Icon.WhatsApp className="h-5 w-5" /> Order on WhatsApp
              </a>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <a
                  href={TEL_LINK}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-maroon-200 text-sm font-semibold text-maroon-800 transition hover:bg-maroon-50"
                >
                  <Icon.Phone className="h-4 w-4" /> Call {BUSINESS.phone}
                </a>
                <button
                  type="button"
                  onClick={clear}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-cream-300 text-sm font-semibold text-ink-500 transition hover:bg-cream-100"
                >
                  Clear bag
                </button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
