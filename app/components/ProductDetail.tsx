"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { fill, label } from "@/lib/dictionaries";
import { isOptimizable, type Product } from "@/lib/products";
import { WHATSAPP } from "@/lib/site";
import { useI18n } from "./I18nProvider";
import { Icon } from "./Icons";
import { useShop } from "./ShopProvider";

/** Galerie façon grande boutique en ligne : miniatures, grande photo, zoom au survol de la souris. */
function Gallery({ images, name }: { images: string[]; name: string }) {
  const { d } = useI18n();
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const current = images[Math.min(index, images.length - 1)];

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="gallery">
      {images.length > 1 && (
        <div className="gallery-thumbs" role="tablist" aria-orientation="vertical">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={fill(d.product.photo, { n: i + 1, name })}
              className={i === index ? "on" : ""}
              onMouseEnter={() => setIndex(i)}
              onFocus={() => setIndex(i)}
              onClick={() => setIndex(i)}
            >
              <Image src={src} alt="" width={64} height={64} unoptimized={!isOptimizable(src)} />
            </button>
          ))}
        </div>
      )}
      <div className={`gallery-main${zoom ? " zooming" : ""}`} onMouseMove={onMove} onMouseLeave={() => setZoom(null)}>
        <Image
          key={current}
          src={current}
          alt={name}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 50vw"
          unoptimized={!isOptimizable(current)}
          style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        />
      </div>
    </div>
  );
}

export default function ProductDetail({ product: p }: { product: Product }) {
  const { d, lang, to, money, euros, currency } = useI18n();
  const { addToCart } = useShop();
  const t = d.product;
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const orderable = p.inStock && p.price !== null;
  const max = Math.max(1, Math.min(p.stock, 50));

  const rows = [
    p.categoryLabel && { k: t.category, v: label(d, p.categoryLabel) },
    p.sizeLabel && { k: t.size, v: label(d, p.sizeLabel) },
    p.colorTypeLabel && { k: t.colorType, v: label(d, p.colorTypeLabel) },
    p.colors.length > 0 && { k: t.colors, v: p.colors.map((c) => label(d, c)).join(", ") },
  ].filter(Boolean) as { k: string; v: string }[];

  return (
    <div className="pd">
      <Gallery images={p.images} name={p.name} />

      <div className="pd-info">
        {p.categoryLabel && <span className="section-kicker">{label(d, p.categoryLabel)}</span>}
        <h1 className="pd-title">{p.name}</h1>

        <p className="pd-price">
          {p.price === null ? t.onRequest : money(p.price)}
          {p.price !== null && currency !== "EUR" && <small> ({euros(p.price)})</small>}
        </p>
        <p className={`pd-stock${p.inStock ? "" : " out"}`}>{p.inStock ? t.inStock : t.outOfStock}</p>

        {rows.length > 0 && (
          <dl className="pd-specs">
            {rows.map((r) => (
              <div key={r.k}><dt>{r.k}</dt><dd>{r.v}</dd></div>
            ))}
          </dl>
        )}

        {orderable && (
          <div className="pd-buy">
            <label className="pd-qty">
              {t.quantity}
              <span className="qty">
                <button type="button" aria-label={d.cart.decrease} onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span aria-live="polite">{qty}</span>
                <button type="button" aria-label={d.cart.increase} onClick={() => setQty((q) => Math.min(max, q + 1))}>+</button>
              </span>
            </label>
            <button
              className="btn"
              type="button"
              onClick={() => {
                addToCart(p, qty);
                setAdded(true);
              }}
            >
              <Icon name="cart" /> {t.add}
            </button>
            {added && <Link className="text-link" href={to("/panier")}>{t.goCart} →</Link>}
          </div>
        )}

        <p className="muted-small pd-ship"><Icon name="truck" /> {t.shipping}</p>

        <h2 className="pd-h2">{t.description}</h2>
        <p className="pd-desc">{p.description}</p>

        <p className="pd-ask">
          {t.ask}{" "}
          <a
            className="text-link"
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(fill(t.askMsg, { name: p.name }))}`}
            target="_blank"
            rel="noopener noreferrer"
            lang={lang}
          >
            {t.askCta}
          </a>
        </p>
      </div>
    </div>
  );
}
