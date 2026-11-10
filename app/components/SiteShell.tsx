import type { ReactNode } from "react";
import Link from "next/link";
import Header from "./Header";
import { Icon } from "./Icons";
import ShopProvider from "./ShopProvider";

// Numéro WhatsApp de la boutique, au format international sans « + » ni espaces.
const WHATSAPP = "261341234567";

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

      <a
        className="whatsapp"
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Bonjour ArtMadagascar, j'ai une question.")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Nous écrire sur WhatsApp"
        title="Nous écrire sur WhatsApp"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path fill="currentColor" d="M16 3C8.8 3 3 8.7 3 15.8c0 2.300.600 4.500 1.800 6.400L3 29l7-1.800c1.800 1 3.900 1.500 6 1.500 7.200 0 13-5.700 13-12.800C29 8.700 23.200 3 16 3zm0 23.300c-1.900 0-3.800-.500-5.400-1.500l-.400-.200-4.100 1.100 1.100-4-.300-.400a10.300 10.300 0 0 1-1.600-5.500C5.300 10 10.100 5.300 16 5.300S26.700 10 26.700 15.800 21.900 26.300 16 26.300zm5.900-7.900c-.300-.200-1.900-.900-2.200-1-.300-.100-.500-.200-.700.200-.200.300-.800 1-1 1.200-.200.200-.400.200-.700.100-1.900-.900-3.100-1.700-4.300-3.800-.300-.600.300-.500.900-1.700.100-.200 0-.400 0-.600-.100-.200-.700-1.700-1-2.300-.300-.600-.500-.500-.700-.500h-.600c-.200 0-.600.100-.900.400-.300.300-1.200 1.100-1.200 2.800s1.200 3.200 1.400 3.500c.200.200 2.400 3.700 5.900 5.200 2.200.900 3 1 4.100.800.700-.100 1.900-.800 2.200-1.600.300-.800.300-1.400.200-1.600-.100-.100-.300-.200-.600-.400z" />
        </svg>
      </a>
    </ShopProvider>
  );
}
