import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/catalog";
import Catalog from "@/app/components/Catalog";
import { Icon } from "@/app/components/Icons";

export const metadata: Metadata = {
  title: "Boutique — ArtMadagascar",
  description: "Sacs en raphia, sculptures, bijoux, textiles et souvenirs : toute l'artisanat malgache en un seul endroit.",
};

async function CatalogData() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return <Catalog products={products} categories={categories} />;
}

export default function BoutiquePage() {
  return (
    <>
      <section className="shop-hero">
        <Image className="shop-hero-bg" src="/hero.png" alt="" fill priority sizes="100vw" />
        <div className="shop-hero-inner">
          <h1>Notre <span>Boutique</span></h1>
          <p>Découvrez notre sélection d’artisanat malgache, unique et authentique.</p>
        </div>
      </section>

      <section className="section shop-section">
        <Suspense fallback={<p className="no-result">Chargement de la boutique…</p>}>
          <CatalogData />
        </Suspense>
      </section>

      <section className="shop-cta">
        <div>
          <h2>Soutenez l’artisanat malgache !</h2>
          <p>En achetant nos produits, vous aidez directement nos artisans.</p>
        </div>
        <Link className="btn" href="/a-propos">Découvrir notre engagement <Icon name="arrow" /></Link>
      </section>
    </>
  );
}
