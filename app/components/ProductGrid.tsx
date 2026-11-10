"use client";

import Image from "next/image";
import { useState } from "react";
import { formatAr, isOptimizable, type Product } from "@/lib/products";
import { Icon } from "./Icons";
import { useShop } from "./ShopProvider";

function ProductCard({ p }: { p: Product }) {
  const [liked, setLiked] = useState(false);
  const { addToCart } = useShop();
  const orderable = p.inStock && p.price !== null;
  return (
    <article className="product">
      <div className="product-image">
        <Image src={p.image} alt={p.name} fill sizes="(max-width: 760px) 50vw, 20vw" unoptimized={!isOptimizable(p.image)} />
        <button
          className={`heart${liked ? " on" : ""}`}
          aria-label="Ajouter aux favoris"
          aria-pressed={liked}
          onClick={() => setLiked((l) => !l)}
        >
          <Icon name="heart" />
        </button>
      </div>
      <div className="product-info">
        <h3>{p.name}</h3>
        <div className="price-row">
          <span className="price">{p.price === null ? "Sur demande" : formatAr(p.price)}</span>
          <button
            className="add-cart"
            aria-label={`Ajouter ${p.name} au panier`}
            onClick={() => addToCart(p)}
            disabled={!orderable}
            title={orderable ? undefined : p.inStock ? "Prix sur demande" : "Rupture de stock"}
          >
            <Icon name="cart" />
          </button>
        </div>
        {!p.inStock && <div className="rating"><span className="oos">Rupture de stock</span></div>}
      </div>
    </article>
  );
}

export default function ProductGrid({ items, className = "", filterByQuery = true }: { items: Product[]; className?: string; filterByQuery?: boolean }) {
  const { query } = useShop();
  const term = filterByQuery ? query.trim().toLocaleLowerCase("fr") : "";
  const list = items.filter((p) => p.name.toLocaleLowerCase("fr").includes(term));
  return (
    <div className={`products ${className}`}>
      {list.length ? list.map((p) => <ProductCard key={p.id} p={p} />) : <p className="no-result">Aucun article trouvé.</p>}
    </div>
  );
}
