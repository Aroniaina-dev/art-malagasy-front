"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();

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
          {/* La saisie filtre la liste en direct ; Entrée ouvre la boutique avec la recherche appliquée. */}
          <form
            className="search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/boutique#resultats");
            }}
          >
            <button type="submit" className="search-btn" aria-label="Rechercher"><Icon name="search" /></button>
            <input
              type="search"
              aria-label="Rechercher un article"
              placeholder="Rechercher un article..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
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
