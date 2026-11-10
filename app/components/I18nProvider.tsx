"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { href as buildHref, type Dict, type Lang } from "@/lib/dictionaries";

export type Currency = "MGA" | "EUR" | "USD";
export const currencies: Currency[] = ["EUR", "USD", "MGA"];

/* Taux indicatifs (ariary pour 1 unité), ajustables par variables d'environnement.
   La commande est toujours enregistrée et facturée en ariary par le back. */
const RATES: Record<Currency, number> = {
  MGA: 1,
  EUR: Number(process.env.NEXT_PUBLIC_RATE_EUR) || 5100,
  USD: Number(process.env.NEXT_PUBLIC_RATE_USD) || 4500,
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
  /** Prix en ariary → texte dans la devise choisie. */
  money: (ariary: number) => string;
  /** Toujours en ariary (montant réellement facturé). */
  ariary: (n: number) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

const formatAriary = (n: number, lang: Lang) => `${Math.round(n).toLocaleString(lang === "fr" ? "fr-FR" : "en-US").replace(/[  ]/g, " ")} Ar`;

export default function I18nProvider({ lang, d, children }: { lang: Lang; d: Dict; children: ReactNode }) {
  // Par défaut : ariary en français, euro en anglais (visiteurs étrangers).
  const fallback: Currency = lang === "fr" ? "MGA" : "EUR";
  const stored = useSyncExternalStore(subscribe, read, () => "");
  const currency = (currencies as string[]).includes(stored) ? (stored as Currency) : fallback;

  const setCurrency = useCallback((c: Currency) => {
    try {
      localStorage.setItem(KEY, c);
    } catch {}
    listeners.forEach((l) => l());
  }, []);

  const value = useMemo<Ctx>(() => {
    const locale = lang === "fr" ? "fr-FR" : "en-US";
    return {
      lang,
      d,
      to: (path) => buildHref(lang, path),
      currency,
      setCurrency,
      ariary: (n) => formatAriary(n, lang),
      money: (n) =>
        currency === "MGA"
          ? formatAriary(n, lang)
          : new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(n / RATES[currency]),
    };
  }, [lang, d, currency, setCurrency]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
