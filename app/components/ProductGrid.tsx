"use client";

import Image from "next/image";
import { useState } from "react";
import { fill, label } from "@/lib/dictionaries";
import { isOptimizable, type Product } from "@/lib/products";
import { useI18n } from "./I18nProvider";
import { Icon } from "./Icons";
import { useShop } from "./ShopProvider";

function ProductCard({ p }: { p: Product }) {
  const [liked, setLiked] = useState(false);
  const { addToCart } = useShop();
  const { d, money, ariary, currency } = useI18n();
  const orderable = p.inStock && p.price !== null;
  const meta = [
    p.sizeLabel && label(d, p.sizeLabel),
    p.colors.length ? p.colors.map((c) => label(d, c)).join(", ") : p.colorTypeLabel && label(d, p.colorTypeLabel),
  ].filter(Boolean);

  return (
    <article className="product">
      <div className="product-image">
        <Image src={p.image} alt={p.name} fill sizes="(max-width: 760px) 50vw, 20vw" unoptimized={!isOptimizable(p.image)} />
        <button className={`heart${liked ? " on" : ""}`} aria-label={d.product.favorite} aria-pressed={liked} onClick={() => setLiked((l) => !l)}>
          <Icon name="heart" />
        </button>
      </div>
      <div className="product-info">
        <h3>{p.name}</h3>
        {meta.length > 0 && <p className="product-meta">{meta.join(" · ")}</p>}
        <div className="price-row">
          <span className="price" title={p.price !== null && currency !== "MGA" ? ariary(p.price) : undefined}>
            {p.price === null ? d.product.onRequest : money(p.price)}
          </span>
          <button
            className="add-cart"
            aria-label={fill(d.product.addToCart, { name: p.name })}
            onClick={() => addToCart(p)}
            disabled={!orderable}
            title={orderable ? undefined : p.inStock ? d.product.priceOnRequest : d.product.outOfStock}
          >
            <Icon name="cart" />
          </button>
        </div>
        {!p.inStock && <div className="rating"><span className="oos">{d.product.outOfStock}</span></div>}
      </div>
    </article>
  );
}

export default function ProductGrid({ items, className = "", filterByQuery = true }: { items: Product[]; className?: string; filterByQuery?: boolean }) {
  const { query } = useShop();
  const { d } = useI18n();
  const term = filterByQuery ? query.trim().toLocaleLowerCase("fr") : "";
  const list = items.filter((p) => p.name.toLocaleLowerCase("fr").includes(term));
  return (
    <div className={`products ${className}`}>
      {list.length ? list.map((p) => <ProductCard key={p.id} p={p} />) : <p className="no-result">{d.shop.noResult}</p>}
    </div>
  );
}
