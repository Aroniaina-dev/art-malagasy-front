import Image from "next/image";
import { Icon } from "@/app/components/Icons";
import Link from "next/link";
import ProductGrid from "@/app/components/ProductGrid";
import { Suspense } from "react";
import { hasCategoryImage } from "@/lib/products";
import { getCategories, getProducts, safe } from "@/lib/catalog";

const benefits = [
  { icon: "shield", title: "Paiement sécurisé", text: "Achetez en toute confiance" },
  { icon: "truck", title: "Livraison rapide", text: "Partout à Madagascar" },
  { icon: "headset", title: "Service client réactif", text: "Nous sommes là pour vous" },
  { icon: "heart", title: "Soutien aux artisans", text: "Ensemble, valorisons notre culture" },
];


export default function Home() {
  return (
    <>
        <section className="hero">
          <Image className="hero-bg" src="/hero.png" alt="" fill priority sizes="100vw" />
          <div className="hero-inner">
            <div className="eyebrow">L&apos;artisanat de nos régions</div>
            <h1>Découvrez l’authenticité <span>de Madagascar</span></h1>
            <p>Des créations uniques, faites main par nos artisans locaux : sacs, vannerie, bijoux, objets déco et bien plus encore.</p>
            <Link className="btn" href="/boutique">Découvrir la boutique <Icon name="arrow" /></Link>
          </div>
        </section>

        <div className="categories-wrap">
          <Suspense fallback={<nav className="categories" aria-busy="true" />}>
            <CategoryBar />
          </Suspense>
        </div>

        <section className="benefits">
          <div className="benefit-row">
            {benefits.map((b) => (
              <div className="benefit" key={b.title}>
                <span className="symbol"><Icon name={b.icon} /></span>
                <div><strong>{b.title}</strong><small>{b.text}</small></div>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="boutique">
          <div className="section-heading">
            <h2>Nos coups de cœur</h2>
            <Link className="text-link" href="/boutique">Voir toute la boutique →</Link>
          </div>
          <div className="product-layout">
            <Suspense fallback={<div className="products" aria-busy="true" />}>
              <FeaturedProducts />
            </Suspense>
            <aside className="promo">
              <div className="madagascar">🇲🇬</div>
              <h3>Soutenez l’artisanat malgache !</h3>
              <p>Un achat, un impact positif pour nos artisans. Chaque création raconte une histoire et fait vivre un savoir-faire local.</p>
              <Link className="btn" href="/a-propos">En savoir plus <Icon name="arrow" /></Link>
            </aside>
          </div>
        </section>

        <section className="story" id="histoire">
          <div className="story-inner">
            <div>
              <div className="eyebrow">Un savoir-faire à partager</div>
              <h2>Chaque création a une histoire.</h2>
              <p>Nous mettons en lumière les talents des artisans malgaches et leurs créations réalisées avec passion. En choisissant leurs produits, vous soutenez des communautés locales et contribuez à préserver des techniques artisanales transmises de génération en génération.</p>
              <Link className="btn" href="/boutique">Explorer les créations <Icon name="arrow" /></Link>
            </div>
            <div className="story-photo" role="img" aria-label="Ambiance artisanale et décoration naturelle" />
          </div>
        </section>
          </>
  );
}

async function FeaturedProducts() {
  const items = await safe(getProducts(5));
  if (!items) return <p className="no-result">Notre catalogue est momentanément indisponible. Réessayez dans un instant.</p>;
  return <ProductGrid items={items} />;
}

async function CategoryBar() {
  const categories = await safe(getCategories());
  if (!categories) return null;
  return (
    <nav className="categories" aria-label="Catégories">
      {categories.map((c) => (
        <Link key={c.id} className="category" href="/boutique">
          {hasCategoryImage(c.label) && <Image src={`/categories/${c.slug}.png`} alt="" width={72} height={72} />}
          {c.label}
        </Link>
      ))}
    </nav>
  );
}
