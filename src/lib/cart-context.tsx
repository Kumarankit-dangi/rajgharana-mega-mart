"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  key: string;
  slug: string;
  name: string;
  price: number;
  mrp: number;
  image: string;
  size: string;
  qty: number;
};

type AddInput = Omit<CartItem, "key" | "qty"> & { qty?: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  savings: number;
  isOpen: boolean;
  hydrated: boolean;
  add: (item: AddInput) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "rmm-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<{ name: string; id: number } | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage may be unavailable */
    }
  }, [items, hydrated]);

  const add = useCallback((input: AddInput) => {
    const key = `${input.slug}|${input.size}`;
    const qty = input.qty ?? 1;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: Math.min(10, i.qty + qty) } : i,
        );
      }
      const { qty: _ignored, ...rest } = input;
      void _ignored;
      return [...prev, { ...rest, key, qty }];
    });
    setToast({ name: input.name, id: Date.now() });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty: Math.min(10, qty) } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
    const savings = items.reduce((n, i) => n + (i.mrp - i.price) * i.qty, 0);
    return {
      items,
      count,
      subtotal,
      savings,
      isOpen,
      hydrated,
      add,
      remove,
      setQty,
      clear,
      openCart,
      closeCart,
    };
  }, [items, isOpen, hydrated, add, remove, setQty, clear, openCart, closeCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast && (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="animate-pop fixed bottom-24 left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border border-gold-200 bg-white px-4 py-3 shadow-card"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-maroon-700 text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink-900">{toast.name}</p>
            <p className="text-xs text-ink-500">Added to your bag</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setToast(null);
              setIsOpen(true);
            }}
            className="rounded-full bg-gold-100 px-3 py-1.5 text-xs font-semibold text-maroon-800 transition hover:bg-gold-200"
          >
            View bag
          </button>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
