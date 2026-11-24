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
        <Image
          className="hero-bg"
          src="/hero-ikala-2.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-inner">
          <div className="eyebrow">{d.hero.eyebrow}</div>
          <h1>
            {d.hero.title1} <span>{d.hero.title2}</span>
          </h1>
          <p>{d.hero.text}</p>
          <Link className="btn" href={href(lang, "/boutique")}>
            {d.hero.cta} <Icon name="arrow" />
          </Link>
          <div className="hero-note">{d.hero.note}</div>
        </div>
      </section>

      <section className="trust" aria-label={d.home.trust}>
        {d.benefits.map((b) => (
          <div className="trust-item" key={b.title}>
            <span className="trust-icon">
              <Icon name={b.icon} />
            </span>
            <div>
              <b>{b.title}</b>
              <small>{b.text}</small>
            </div>
          </div>
        ))}
      </section>

      <section className="band band-cream" id="categories">
        <div className="section-head">
          <span className="section-kicker">{d.home.catKicker}</span>
          <h2>{d.home.catTitle}</h2>
          <p>{d.home.catText}</p>
        </div>
        <Suspense fallback={<div className="category-grid" aria-busy="true" />}>
          <CategoryGrid />
        </Suspense>
      </section>

      <section className="band band-sand" id="produits">
        <div className="section-head">
          <span className="section-kicker">{d.home.favKicker}</span>
          <h2>{d.home.favorites}</h2>
          <p>{d.home.favText}</p>
        </div>
        <Suspense fallback={<div className="products" aria-busy="true" />}>
          <FeaturedProducts />
        </Suspense>
        <p className="band-more">
          <Link className="text-link" href={href(lang, "/boutique")}>
            {d.home.seeAll}
          </Link>
        </p>
      </section>

      <section className="band band-white story-band" id="histoire">
        <div className="story-visual" role="img" aria-label={d.home.storyAlt} />
        <div className="story-copy">
          <span className="section-kicker">{d.home.storyEyebrow}</span>
          <h2>{d.home.storyTitle}</h2>
          <p>{d.home.storyText}</p>
          <p>{d.home.storyText2}</p>
          <Link className="btn" href={href(lang, "/boutique")}>
            {d.home.storyCta} <Icon name="arrow" />
          </Link>
        </div>
      </section>

      <section className="contact-band">
        <span className="section-kicker">{d.home.ctaKicker}</span>
        <h2>{d.home.ctaTitle}</h2>
        <p>{d.home.ctaText}</p>
        <Link className="btn" href={href(lang, "/contact")}>
          {d.home.ctaButton} <Icon name="arrow" />
        </Link>
      </section>
    </>
  );
}

async function FeaturedProducts() {
  const { d } = await getI18n();
  const items = await safe(getProducts(4));

  if (!items) return <p className="no-result">{d.home.unavailable}</p>;
  const visibleItems = items.filter((product) => product.hidden !== 1);
  // console.log("Produits visibles :", visibleItems);
  return <ProductGrid items={visibleItems} className="products-home" />;
}

async function CategoryGrid() {
  const { lang, d } = await getI18n();
  const categories = await safe(getCategories());
  if (!categories) return null;
  return (
    <div className="category-grid">
      {categories.map((c) => (
        <Link
          key={c.id}
          className="category-card"
          href={href(lang, "/boutique")}
        >
          {hasCategoryImage(c.label) && (
            <Image
              src={`/categories/${c.slug}.png`}
              alt=""
              width={160}
              height={160}
            />
          )}
          <h3>{label(d, c.label)}</h3>
        </Link>
      ))}
    </div>
  );
}
