"use client";

import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/products";
import { formatEur } from "@/lib/products";
import { BRAND } from "@/lib/site";

type Availability = "all" | "available" | "unavailable";

export default function AdminProductCatalogue({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState<Availability>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const categoryLabels = useMemo(
    () => new Map(categories.map((item) => [item.id, item.label])),
    [categories],
  );
  const filteredProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("fr");
    const minimum = minPrice === "" ? null : Number(minPrice);
    const maximum = maxPrice === "" ? null : Number(maxPrice);

    return products.filter((product) => {
      if (product.hidden === 1) return false;
      if (category && product.category !== category) return false;
      if (availability === "available" && !product.inStock) return false;
      if (availability === "unavailable" && product.inStock) return false;

      if (
        term &&
        ![
          product.name,
          product.description,
          product.categoryLabel,
          product.sizeLabel,
          product.colorTypeLabel,
          ...product.colors,
        ]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLocaleLowerCase("fr").includes(term))
      ) {
        return false;
      }

      if (minimum !== null && (product.price === null || product.price < minimum))
        return false;
      if (maximum !== null && (product.price === null || product.price > maximum))
        return false;
      return true;
    });
  }, [products, search, category, availability, minPrice, maxPrice]);
  const catalogueEntries = filteredProducts.flatMap((product) => {
    const images = product.images.length ? product.images : [product.image];
    return images.map((image, index) => ({
      product,
      image,
      imageNumber: index + 1,
      imageCount: images.length,
    }));
  });

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setAvailability("all");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <main className="admin-catalogue">
      <header className="catalogue-heading">
        <div>
          <p className="catalogue-eyebrow">ÉDITION CLIENT</p>
          <h1 className="admin-title">Catalogue produits</h1>
          <p className="catalogue-intro">
            Sélectionnez les articles à présenter, puis exportez une version
            prête à partager.
          </p>
        </div>
        <button
          className="btn catalogue-export"
          type="button"
          onClick={() => window.print()}
          disabled={filteredProducts.length === 0}
        >
          Exporter en PDF
        </button>
      </header>

      <section className="catalogue-filters" aria-label="Filtres du catalogue">
        <label>
          Rechercher
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nom, description, couleur…"
          />
        </label>
        <label>
          Catégorie
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Disponibilité
          <select
            value={availability}
            onChange={(event) =>
              setAvailability(event.target.value as Availability)
            }
          >
            <option value="all">Tous les produits</option>
            <option value="available">En stock</option>
            <option value="unavailable">Indisponibles</option>
          </select>
        </label>
        <fieldset className="catalogue-price-filter">
          <legend>Prix (€)</legend>
          <label>
            <span className="catalogue-visually-hidden">Prix minimum</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="Min."
            />
          </label>
          <span aria-hidden="true">–</span>
          <label>
            <span className="catalogue-visually-hidden">Prix maximum</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Max."
            />
          </label>
        </fieldset>
        <button
          className="linklike catalogue-reset"
          type="button"
          onClick={resetFilters}
        >
          Réinitialiser les filtres
        </button>
      </section>

      <div className="catalogue-result-bar">
        <p>
          <strong>{filteredProducts.length}</strong>{" "}
          {filteredProducts.length > 1 ? "produits sélectionnés" : "produit sélectionné"}
        </p>
        <p className="catalogue-print-hint">
          L’impression s’ouvrira : choisissez « Enregistrer au format PDF ».
        </p>
      </div>

      <section className="catalogue-sheet" aria-label="Aperçu du catalogue">
        <header className="catalogue-print-heading">
          <p>{BRAND}</p>
          <h2>Catalogue produits</h2>
          <span>
            {filteredProducts.length} articles · {catalogueEntries.length} photos
          </span>
        </header>
        {filteredProducts.length ? (
          <div className="catalogue-products">
            {catalogueEntries.map(
              ({ product, image, imageNumber, imageCount }) => {
              const details = [
                product.sizeLabel && `Taille : ${product.sizeLabel}`,
                product.colors.length
                  ? `Couleurs : ${product.colors.join(", ")}`
                  : product.colorTypeLabel &&
                    `Couleur : ${product.colorTypeLabel}`,
              ].filter(Boolean);

              return (
                <article
                  className="catalogue-product"
                  key={`${product.id}-${imageNumber}`}
                >
                  <div className="catalogue-product-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={`${product.name} — photo ${imageNumber}`}
                    />
                  </div>
                  <div className="catalogue-product-info">
                    {imageCount > 1 && (
                      <p className="catalogue-image-count">
                        Photo {imageNumber} sur {imageCount}
                      </p>
                    )}
                    <p className="catalogue-product-category">
                      {product.categoryLabel ??
                        categoryLabels.get(product.category) ??
                        "Artisanat malgache"}
                    </p>
                    <h3>{product.name}</h3>
                    {product.description && (
                      <p className="catalogue-product-description">
                        {product.description}
                      </p>
                    )}
                    {details.length > 0 && (
                      <p className="catalogue-product-details">
                        {details.join(" · ")}
                      </p>
                    )}
                    <div className="catalogue-product-footer">
                      <strong>
                        {product.price === null
                          ? "Prix sur demande"
                          : formatEur(product.price)}
                      </strong>
                      {/* <span>
                        {product.inStock ? "Disponible" : "Indisponible"}
                      </span> */}
                    </div>
                  </div>
                </article>
              );
              },
            )}
          </div>
        ) : (
          <p className="catalogue-empty">
            Aucun produit ne correspond à ces filtres.
          </p>
        )}
      </section>
    </main>
  );
}
