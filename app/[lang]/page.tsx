import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "@/app/components/Icons";
import ProductGrid from "@/app/components/ProductGrid";
import { getCategories, getProducts, safe } from "@/lib/catalog";
import { href, label } from "@/lib/dictionaries";
import { getI18n } from "@/lib/i18n";
import { hasCategoryImage } from "@/lib/products";

export default async function Home() {
  const { lang, d } = await getI18n();
  return (
    <>
      <section className="hero">
        <Image className="hero-bg" src="/hero.png" alt="" fill priority sizes="100vw" />
        <div className="hero-inner">
          <div className="eyebrow">{d.hero.eyebrow}</div>
          <h1>{d.hero.title1} <span>{d.hero.title2}</span></h1>
          <p>{d.hero.text}</p>
          <Link className="btn" href={href(lang, "/boutique")}>{d.hero.cta} <Icon name="arrow" /></Link>
        </div>
      </section>

      <div className="categories-wrap">
        <Suspense fallback={<nav className="categories" aria-busy="true" />}>
          <CategoryBar />
        </Suspense>
      </div>

      <section className="benefits">
        <div className="benefit-row">
          {d.benefits.map((b) => (
            <div className="benefit" key={b.title}>
              <span className="symbol"><Icon name={b.icon} /></span>
              <div><strong>{b.title}</strong><small>{b.text}</small></div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="boutique">
        <div className="section-heading">
          <h2>{d.home.favorites}</h2>
          <Link className="text-link" href={href(lang, "/boutique")}>{d.home.seeAll}</Link>
        </div>
        <div className="product-layout">
          <Suspense fallback={<div className="products" aria-busy="true" />}>
            <FeaturedProducts />
          </Suspense>
          <aside className="promo">
            <div className="madagascar">🇲🇬</div>
            <h3>{d.home.promoTitle}</h3>
            <p>{d.home.promoText}</p>
            <Link className="btn" href={href(lang, "/a-propos")}>{d.home.promoCta} <Icon name="arrow" /></Link>
          </aside>
        </div>
      </section>

      <section className="story" id="histoire">
        <div className="story-inner">
          <div>
            <div className="eyebrow">{d.home.storyEyebrow}</div>
            <h2>{d.home.storyTitle}</h2>
            <p>{d.home.storyText}</p>
            <Link className="btn" href={href(lang, "/boutique")}>{d.home.storyCta} <Icon name="arrow" /></Link>
          </div>
          <div className="story-photo" role="img" aria-label={d.home.storyAlt} />
        </div>
      </section>
    </>
  );
}

async function FeaturedProducts() {
  const { d } = await getI18n();
  const items = await safe(getProducts(5));
  if (!items) return <p className="no-result">{d.home.unavailable}</p>;
  return <ProductGrid items={items} />;
}

async function CategoryBar() {
  const { lang, d } = await getI18n();
  const categories = await safe(getCategories());
  if (!categories) return null;
  return (
    <nav className="categories" aria-label={d.home.categories}>
      {categories.map((c) => (
        <Link key={c.id} className="category" href={href(lang, "/boutique")}>
          {hasCategoryImage(c.label) && <Image src={`/categories/${c.slug}.png`} alt="" width={72} height={72} />}
          {label(d, c.label)}
        </Link>
      ))}
    </nav>
  );
}
