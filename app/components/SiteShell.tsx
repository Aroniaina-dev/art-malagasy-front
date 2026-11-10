import type { ReactNode } from "react";
import Link from "next/link";
import Header from "./Header";
import { Icon } from "./Icons";
import ShopProvider from "./ShopProvider";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <ShopProvider>
      <div className="topbar">
        <div className="topbar-inner">
          <span><Icon name="truck" /> Livraison partout à Madagascar</span>
          <span><Icon name="star" /> Artisanat 100% Malgache</span>
          <span><Icon name="phone" /> +261 34 12 345 67</span>
          <span className="socials">
            <Icon name="facebook" /><Icon name="instagram" /><Icon name="tiktok" /><Icon name="youtube" />
          </span>
        </div>
      </div>

      <Header />

      <main>{children}</main>

      <footer id="contact">
        <div className="footer-inner">
          <div><h4>ArtMadagascar</h4><p>L’artisanat malgache, notre fierté.<br />Des créations authentiques, faites avec passion.</p></div>
          <div><h4>La boutique</h4><p><Link href="/boutique">Tous les produits</Link><br /><Link href="/boutique">Nouveautés</Link><br /><Link href="/boutique">Meilleures ventes</Link></p></div>
          <div><h4>Informations</h4><p><Link href="/a-propos">À propos</Link><br /><Link href="/blog">Blog</Link><br /><Link href="/suivi">Suivre ma commande</Link><br /><Link href="/contact">Livraison &amp; retours</Link></p></div>
          <div><h4>Contact</h4><p>Antananarivo, Madagascar<br />+261 34 12 345 67<br />contact@artmadagascar.mg</p></div>
        </div>
      </footer>
    </ShopProvider>
  );
}
