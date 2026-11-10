"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Icon } from "./Icons";
import { useShop } from "./ShopProvider";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/boutique", label: "Boutique" },
  { href: "/a-propos", label: "À propos" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

/** usePathname est une donnée de requête : isolé dans Suspense pour ne pas bloquer le pré-rendu des routes dynamiques. */
function NavLinks() {
  const pathname = usePathname();
  return <LinkList pathname={pathname} />;
}

function LinkList({ pathname }: { pathname: string | null }) {
  return (
    <>
      {links.map((l) => {
        const active = pathname !== null && (l.href === "/" ? pathname === "/" : pathname.startsWith(l.href));
        return (
          <Link key={l.href} href={l.href} className={active ? "active" : ""}>
            {l.label}
            {l.href === "/boutique" && <Icon name="chevron" />}
          </Link>
        );
      })}
    </>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { cart, query, setQuery } = useShop();

  return (
    <header className="main-header">
      <div className="header-inner">
        <button className="menu-toggle" aria-label="Ouvrir le menu" onClick={() => setOpen((o) => !o)}>
          <Icon name="menu" />
        </button>
        <Link className="brand" href="/" aria-label="ArtMadagascar, accueil">
          <Image src="/logo.png" alt="ArtMadagascar" width={168} height={56} priority style={{ height: "auto" }} />
        </Link>
        <nav className={open ? "open" : ""} onClick={() => setOpen(false)}>
          <Suspense fallback={<LinkList pathname={null} />}>
            <NavLinks />
          </Suspense>
        </nav>
        <div className="header-actions">
          <label className="search">
            <Icon name="search" />
            <input
              type="search"
              placeholder="Rechercher un article..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <Link className="icon-btn" href="/compte" aria-label="Mon compte"><Icon name="user" /></Link>
          <Link className="icon-btn" href="/panier" aria-label={`Panier (${cart})`}>
            <Icon name="cart" />
            <span className="cart-count">{cart}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
