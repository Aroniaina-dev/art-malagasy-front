"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { formatAr, isOptimizable } from "@/lib/products";
import { placeOrder, type OrderState } from "../actions/orders";
import { useShop } from "./ShopProvider";

export default function CartView() {
  const { items, total, setQty, clearCart } = useShop();
  const [state, action, pending] = useActionState<OrderState, FormData>(placeOrder, {});

  if (!items.length) {
    return (
      <div className="form-done">
        <h3>Votre panier est vide</h3>
        <p>Découvrez nos créations artisanales.</p>
        <Link className="btn" href="/boutique">Aller à la boutique</Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <div className="cart-items">
        {items.map((i) => (
          <div className="cart-row" key={i.id}>
            <div className="cart-thumb">
              <Image src={i.image} alt="" fill sizes="80px" unoptimized={!isOptimizable(i.image)} />
            </div>
            <div className="cart-name"><strong>{i.name}</strong><span>{formatAr(i.price)}</span></div>
            <div className="qty">
              <button aria-label="Diminuer" onClick={() => setQty(i.id, i.qty - 1)}>−</button>
              <span>{i.qty}</span>
              <button aria-label="Augmenter" onClick={() => setQty(i.id, i.qty + 1)}>+</button>
            </div>
            <strong className="cart-line">{formatAr(i.price * i.qty)}</strong>
            <button className="cart-remove" aria-label={`Retirer ${i.name}`} onClick={() => setQty(i.id, 0)}>×</button>
          </div>
        ))}
        <p className="cart-note">Les prix et le stock sont revérifiés au moment de la commande.</p>
      </div>

      <aside className="cart-summary">
        <h3>Récapitulatif</h3>
        <p className="cart-total"><span>Total</span><strong>{formatAr(total)}</strong></p>
        <p className="muted-small">Pas de compte nécessaire. Vous recevrez un code pour suivre votre commande ; le paiement est confirmé par notre équipe.</p>

        <form className="contact-form checkout" action={action}>
          <input type="hidden" name="cart" value={JSON.stringify(items.map((i) => ({ id: i.id, qty: i.qty })))} />
          <div className="form-row">
            <label>Nom<input name="nom" required autoComplete="family-name" /></label>
            <label>Prénom<input name="prenom" required autoComplete="given-name" /></label>
          </div>
          <label>Téléphone<input name="telephone" type="tel" required autoComplete="tel" /></label>
          <label>Email (facultatif)<input name="email" type="email" autoComplete="email" /></label>
          <label>Adresse de livraison<input name="adresse" required autoComplete="street-address" /></label>
          <label>Ville<input name="ville" required autoComplete="address-level2" /></label>
          <label>Instructions (facultatif)<textarea name="instructions" rows={2} /></label>
          {state.error && <p className="form-error" role="alert">{state.error}</p>}
          <button className="btn" type="submit" disabled={pending}>{pending ? "Envoi…" : "Passer la commande"}</button>
        </form>
        <button className="text-link linklike" onClick={clearCart}>Vider le panier</button>
      </aside>
    </div>
  );
}
