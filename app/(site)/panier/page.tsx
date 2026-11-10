import type { Metadata } from "next";
import CartView from "@/app/components/CartView";

export const metadata: Metadata = { title: "Panier — ArtMadagascar" };

export default function CartPage() {
  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">Mon panier</div>
        <h1>Votre commande</h1>
      </section>
      <section className="section">
        <CartView />
      </section>
    </>
  );
}
