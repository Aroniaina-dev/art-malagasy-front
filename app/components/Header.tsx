"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { locales, type Lang } from "@/lib/dictionaries";
import { currencies, useI18n, type Currency } from "./I18nProvider";
import { Icon } from "./Icons";
import { useShop } from "./ShopProvider";

const paths = ["/", "/boutique", "/a-propos", "/blog", "/contact"] as const;

/** Chemin sans le préfixe de langue : "/en/boutique" → "/boutique". */
const strip = (pathname: string) => pathname.replace(/^\/(fr|en)(?=\/|$)/, "") || "/";

/** usePathname est une donnée de requête : isolé dans Suspense pour ne pas bloquer le pré-rendu des routes dynamiques. */
function NavLinks() {
  return <LinkList current={strip(usePathname())} />;
}

function LinkList({ current }: { current: string | null }) {
  const { d, to } = useI18n();
  const labels: Record<(typeof paths)[number], string> = {
    "/": d.nav.home,
    "/boutique": d.nav.shop,
    "/a-propos": d.nav.about,
    "/blog": d.nav.blog,
    "/contact": d.nav.contact,
  };
  return (
    <>
      {paths.map((p) => {
        const active = current !== null && (p === "/" ? current === "/" : current.startsWith(p));
        return (
          <Link key={p} href={to(p)} className={active ? "active" : ""}>
            {labels[p]}
            {p === "/boutique" && <Icon name="chevron" />}
          </Link>
        );
      })}
    </>
  );
}

/** Bascule de langue : même page, autre préfixe. Le choix est mémorisé dans un cookie lu par proxy.ts. */
function LangSwitch() {
  const { lang, d } = useI18n();
  const rest = strip(usePathname());
  return (
    <span className="switch" role="group" aria-label={d.nav.language}>
      {locales.map((l: Lang) => (
        <a
          key={l}
          href={`/${l}${rest === "/" ? "" : rest}`}
          className={l === lang ? "on" : ""}
          aria-current={l === lang ? "true" : undefined}
          hrefLang={l}
          onClick={() => {
            document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
          }}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </span>
  );
}

function CurrencySwitch() {
  const { currency, setCurrency, d } = useI18n();
  return (
    <select className="currency" aria-label={d.nav.currency} value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
      {currencies.map((c) => <option key={c} value={c}>{c === "MGA" ? "Ar (MGA)" : c === "EUR" ? "€ (EUR)" : "$ (USD)"}</option>)}
    </select>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { cart, query, setQuery } = useShop();
  const { d, to } = useI18n();
  const router = useRouter();

  return (
    <header className="main-header">
      <div className="header-inner">
        <button className="menu-toggle" aria-label={d.nav.menu} onClick={() => setOpen((o) => !o)}>
          <Icon name="menu" />
        </button>
        <Link className="brand" href={to("/")} aria-label="ArtMadagascar">
          <Image src="/logo.png" alt="ArtMadagascar" width={168} height={56} priority style={{ height: "auto" }} />
        </Link>
        <nav className={open ? "open" : ""} onClick={() => setOpen(false)}>
          <Suspense fallback={<LinkList current={null} />}>
            <NavLinks />
          </Suspense>
        </nav>
        <div className="header-actions">
          {/* La saisie filtre la liste en direct ; Entrée ouvre la boutique avec la recherche appliquée. */}
          <form
            className="search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`${to("/boutique")}#resultats`);
            }}
          >
            <button type="submit" className="search-btn" aria-label={d.nav.searchLabel}><Icon name="search" /></button>
            <input type="search" aria-label={d.nav.searchLabel} placeholder={d.nav.search} value={query} onChange={(e) => setQuery(e.target.value)} />
          </form>
          <div className="prefs">
            <Suspense fallback={null}>
              <LangSwitch />
            </Suspense>
            <CurrencySwitch />
          </div>
          <Link className="icon-btn" href={to("/compte")} aria-label={d.nav.account}><Icon name="user" /></Link>
          <Link className="icon-btn" href={to("/panier")} aria-label={`${d.nav.cart} (${cart})`}>
            <Icon name="cart" />
            <span className="cart-count">{cart}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
