import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Catalog from "@/app/components/Catalog";
import { Icon } from "@/app/components/Icons";
import { getCategories, getColorTypes, getProducts, getSizes, safe } from "@/lib/catalog";
import { href } from "@/lib/dictionaries";
import { getI18n } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n();
  return { title: d.shop.metaTitle, description: d.shop.intro };
}

async function CatalogData() {
  const { d } = await getI18n();
  const [products, categories, sizes, colorTypes] = await Promise.all([
    safe(getProducts()),
    safe(getCategories()),
    safe(getSizes()),
    safe(getColorTypes()),
  ]);
  if (!products || !categories) return <p className="no-result">{d.shop.unavailable}</p>;
  return <Catalog products={products} categories={categories} sizes={sizes ?? []} colorTypes={colorTypes ?? []} />;
}

export default async function BoutiquePage() {
  const { lang, d } = await getI18n();
  return (
    <>
      <section className="shop-hero">
        <Image className="shop-hero-bg" src="/hero.png" alt="" fill priority sizes="100vw" />
        <div className="shop-hero-inner">
          <h1>{d.shop.title1} <span>{d.shop.title2}</span></h1>
          <p>{d.shop.intro}</p>
        </div>
      </section>

      <section className="section shop-section" id="resultats">
        <Suspense fallback={<p className="no-result">{d.shop.loading}</p>}>
          <CatalogData />
        </Suspense>
      </section>

      <section className="shop-cta">
        <div>
          <h2>{d.shop.ctaTitle}</h2>
          <p>{d.shop.ctaText}</p>
        </div>
        <Link className="btn" href={href(lang, "/a-propos")}>{d.shop.ctaButton} <Icon name="arrow" /></Link>
      </section>
    </>
  );
}
