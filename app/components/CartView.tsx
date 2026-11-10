"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { fill } from "@/lib/dictionaries";
import { isOptimizable } from "@/lib/products";
import { placeOrder, type OrderState } from "../actions/orders";
import { useI18n } from "./I18nProvider";
import { useShop } from "./ShopProvider";

export default function CartView() {
  const { items, total, setQty, clearCart } = useShop();
  const { d, lang, to, money, ariary, currency } = useI18n();
  const c = d.cart;
  const [state, action, pending] = useActionState<OrderState, FormData>(placeOrder, {});

  if (!items.length) {
    return (
      <div className="form-done">
        <h3>{c.empty}</h3>
        <p>{c.emptyText}</p>
        <Link className="btn" href={to("/boutique")}>{c.goShop}</Link>
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
            <div className="cart-name"><strong>{i.name}</strong><span>{money(i.price)}</span></div>
            <div className="qty">
              <button aria-label={c.decrease} onClick={() => setQty(i.id, i.qty - 1)}>−</button>
              <span>{i.qty}</span>
              <button aria-label={c.increase} onClick={() => setQty(i.id, i.qty + 1)}>+</button>
            </div>
            <strong className="cart-line">{money(i.price * i.qty)}</strong>
            <button className="cart-remove" aria-label={fill(c.remove, { name: i.name })} onClick={() => setQty(i.id, 0)}>×</button>
          </div>
        ))}
        <p className="cart-note">{c.recheck}</p>
      </div>

      <aside className="cart-summary">
        <h3>{c.summary}</h3>
        <p className="cart-total"><span>{c.total}</span><strong>{money(total)}</strong></p>
        {currency !== "MGA" && <p className="muted-small">{fill(c.billed, { amount: ariary(total) })}</p>}
        <p className="muted-small">{c.noAccount}</p>

        <form className="contact-form checkout" action={action}>
          <input type="hidden" name="lang" value={lang} />
          <input type="hidden" name="cart" value={JSON.stringify(items.map((i) => ({ id: i.id, qty: i.qty })))} />
          <div className="form-row">
            <label>{c.lastName}<input name="nom" required autoComplete="family-name" /></label>
            <label>{c.firstName}<input name="prenom" required autoComplete="given-name" /></label>
          </div>
          <label>{c.phone}<input name="telephone" type="tel" required autoComplete="tel" placeholder="+33 6 12 34 56 78" /></label>
          <label>{c.email}<input name="email" type="email" autoComplete="email" /></label>
          <label>{c.address}<input name="adresse" required autoComplete="street-address" /></label>
          <label>{c.city}<input name="ville" required autoComplete="address-level2" /></label>
          <label>{c.notes}<textarea name="instructions" rows={2} /></label>
          {state.error && <p className="form-error" role="alert">{state.error}</p>}
          <button className="btn" type="submit" disabled={pending}>{pending ? c.sending : c.order}</button>
        </form>
        <button className="text-link linklike" onClick={clearCart}>{c.clear}</button>
      </aside>
    </div>
  );
}
