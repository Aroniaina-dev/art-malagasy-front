"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import type { Product } from "@/lib/products";
import { useI18n } from "./I18nProvider";

export type CartItem = { id: string; name: string; image: string; price: number; qty: number };

type Shop = {
  items: CartItem[];
  cart: number;
  total: number;
  addToCart: (p: Product) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  query: string;
  setQuery: (q: string) => void;
};

const ShopContext = createContext<Shop | null>(null);
const STORAGE_KEY = "artmada-cart";

/* Le panier vit dans localStorage (lu via useSyncExternalStore : pas de flash ni de setState en effet).
   Les prix et le stock sont de toute façon revérifiés par le back à la commande. */
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
};
const getSnapshot = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
};
const getServerSnapshot = () => "[]";

const parse = (raw: string): CartItem[] => {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

function write(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
  listeners.forEach((l) => l());
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}

export default function ShopProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items = useMemo(() => parse(raw), [raw]);
  const added = useI18n().d.product.added;
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const addToCart = useCallback((p: Product) => {
    const cur = parse(getSnapshot());
    const found = cur.find((i) => i.id === p.id);
    write(
      found
        ? cur.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...cur, { id: p.id, name: p.name, image: p.image, price: p.price ?? 0, qty: 1 }],
    );
    setToast(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(false), 1800);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    const cur = parse(getSnapshot());
    write(qty <= 0 ? cur.filter((i) => i.id !== id) : cur.map((i) => (i.id === id ? { ...i, qty } : i)));
  }, []);

  const clearCart = useCallback(() => write([]), []);

  const value = useMemo<Shop>(
    () => ({
      items,
      cart: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.price, 0),
      addToCart,
      setQty,
      clearCart,
      query,
      setQuery,
    }),
    [items, addToCart, setQty, clearCart, query],
  );

  return (
    <ShopContext.Provider value={value}>
      {children}
      <div className={`toast${toast ? " show" : ""}`} role="status">
        {added}
      </div>
    </ShopContext.Provider>
  );
}
