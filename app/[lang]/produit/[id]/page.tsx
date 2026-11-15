import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ProductDetail from "@/app/components/ProductDetail";
import { getProduct, safe } from "@/lib/catalog";
import { href } from "@/lib/dictionaries";
import { getI18n } from "@/lib/i18n";
import { BRAND } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = await safe(getProduct(id));
  return p ? { title: `${p.name} | ${BRAND}`, description: p.description.slice(0, 160) } : {};
}

async function Detail({ params }: Props) {
  const { id } = await params;
  const { lang, d } = await getI18n();
  const product = await safe(getProduct(id));

  return (
    <>
      <p className="pd-back"><Link className="text-link" href={href(lang, "/boutique")}>{d.product.back}</Link></p>
      {product ? (
        <ProductDetail product={product} />
      ) : (
        <div className="form-done">
          <h3>{d.product.notFoundTitle}</h3>
          <p>{d.product.notFoundText}</p>
          <Link className="btn" href={href(lang, "/boutique")}>{d.cart.goShop}</Link>
        </div>
      )}
    </>
  );
}

export default function ProductPage({ params }: Props) {
  return (
    <section className="section pd-section">
      <Suspense fallback={<p className="no-result">…</p>}>
        <Detail params={params} />
      </Suspense>
    </section>
  );
}
