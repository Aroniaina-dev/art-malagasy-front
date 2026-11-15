"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { href as buildHref, type Dict, type Lang } from "@/lib/dictionaries";

export type Currency = "EUR" | "USD";
export const currencies: Currency[] = ["EUR", "USD"];

/* Les prix sont saisis, enregistrés et facturés en euros. Le dollar n'est qu'un affichage indicatif,
   au taux NEXT_PUBLIC_EUR_TO_USD (dollars pour 1 euro). */
export const RATES: Record<Currency, number> = {
  EUR: 1,
  USD: Number(process.env.NEXT_PUBLIC_EUR_TO_USD) || 1.08,
};

const KEY = "artmada-currency";
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
};
const read = () => {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
};

type Ctx = {
  lang: Lang;
  d: Dict;
  /** Lien interne préfixé par la langue. */
  to: (path: string) => string;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Prix en euros → texte dans la devise choisie. */
  money: (euros: number) => string;
  /** Toujours en euros (montant réellement facturé). */
  euros: (n: number) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

export default function I18nProvider({ lang, d, children }: { lang: Lang; d: Dict; children: ReactNode }) {
  // L'euro est la devise de référence et celle affichée par défaut.
  const fallback: Currency = "EUR";
  const stored = useSyncExternalStore(subscribe, read, () => "");
  const currency = (currencies as string[]).includes(stored) ? (stored as Currency) : fallback;

  const setCurrency = useCallback((c: Currency) => {
    try {
      localStorage.setItem(KEY, c);
    } catch {}
    listeners.forEach((l) => l());
  }, []);

  const value = useMemo<Ctx>(() => {
    const locale = lang === "fr" ? "fr-FR" : "en-IE";
    return {
      lang,
      d,
      to: (path) => buildHref(lang, path),
      currency,
      setCurrency,
      euros: (n) => new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(n),
      money: (n) => new Intl.NumberFormat(locale, { style: "currency", currency }).format(n * RATES[currency]),
    };
  }, [lang, d, currency, setCurrency]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
