import type { Metadata } from "next";
import ContactForm from "@/app/components/ContactForm";
import { Icon } from "@/app/components/Icons";

export const metadata: Metadata = {
  title: "Contact — ArtMadagascar",
  description: "Une question sur une commande ou un produit ? Écrivez-nous.",
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">Contact</div>
        <h1>Parlons-en</h1>
        <p>Une question sur une commande, un produit ou la livraison ? Nous vous répondons rapidement.</p>
      </section>
      <section className="section">
        <div className="contact-layout">
          <ContactForm />
          <aside className="contact-info">
            <h3>Nos coordonnées</h3>
            <p><Icon name="phone" /> +261 34 12 345 67</p>
            <p><Icon name="user" /> contact@artmadagascar.mg</p>
            <p><Icon name="truck" /> Antananarivo, Madagascar</p>
            <p className="muted">Du lundi au samedi, de 8h à 17h.</p>
          </aside>
        </div>
      </section>
    </>
  );
}
