"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { hasCategoryImage, type Category, type Product, type Ref } from "@/lib/products";
import { Icon } from "./Icons";
import ProductGrid from "./ProductGrid";
import { useShop } from "./ShopProvider";

const PAGE_SIZE = 8;

const priceRanges = [
  { id: "lt20", label: "Moins de 20 000 Ar", test: (p: Product) => p.price !== null && p.price < 20000 },
  { id: "20-50", label: "20 000 Ar – 50 000 Ar", test: (p: Product) => p.price !== null && p.price >= 20000 && p.price <= 50000 },
  { id: "50-100", label: "50 000 Ar – 100 000 Ar", test: (p: Product) => p.price !== null && p.price > 50000 && p.price <= 100000 },
  { id: "gt100", label: "Plus de 100 000 Ar", test: (p: Product) => p.price !== null && p.price > 100000 },
];

const sorts: Record<string, { label: string; fn: (a: Product, b: Product) => number }> = {
  recent: { label: "Nouveautés", fn: () => 0 }, // l'API renvoie déjà les plus récents d'abord (tri stable)
  asc: { label: "Prix croissant", fn: (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity) },
  desc: { label: "Prix décroissant", fn: (a, b) => (b.price ?? -1) - (a.price ?? -1) },
};

function CatIcon({ category }: { category: Category }) {
  if (!category.slug || !hasCategoryImage(category.label)) return <span className="cat-icon" style={{ width: 24, height: 24 }} />;
  return <Image className="cat-icon" src={`/categories/${category.slug}.png`} alt="" width={24} height={24} />;
}

type Props = { products: Product[]; categories: Category[]; sizes: Ref[]; colorTypes: Ref[] };

export default function Catalog({ products, categories, sizes, colorTypes }: Props) {
  const { query, setQuery } = useShop();
  const [cat, setCat] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [colorType, setColorType] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [stockOnly, setStockOnly] = useState(false);
  const [sort, setSort] = useState("recent");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false); // repliés par défaut sur mobile

  const reset = () => {
    setCat(null);
    setSize(null);
    setColorType(null);
    setColor(null);
    setQuery("");
    setPrice(null);
    setStockOnly(false);
    setSort("recent");
    setPage(1);
  };

  const term = query.trim().toLocaleLowerCase("fr");
  const filtered = useMemo(() => {
    const range = priceRanges.find((r) => r.id === price);
    return products
      .filter((p) => (!cat || p.category === cat) && (!size || p.size === size) && (!colorType || p.colorType === colorType))
      .filter((p) => !color || p.colors.some((c) => c.toLocaleLowerCase("fr") === color))
      .filter((p) => (!range || range.test(p)) && (!stockOnly || p.inStock))
      .filter((p) => `${p.name} ${p.description} ${p.colors.join(" ")}`.toLocaleLowerCase("fr").includes(term))
      .sort(sorts[sort].fn);
  }, [products, cat, size, colorType, color, price, stockOnly, term, sort]);

  // Couleurs réellement présentes sur les produits
  const colors = useMemo(
    () => [...new Set(products.flatMap((p) => p.colors.map((c) => c.toLocaleLowerCase("fr"))))].sort((a, b) => a.localeCompare(b, "fr")),
    [products],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const from = filtered.length ? (current - 1) * PAGE_SIZE + 1 : 0;
  const to = (current - 1) * PAGE_SIZE + slice.length;
  const inStockCount = products.filter((p) => p.inStock).length;

  return (
    <div className="shop-layout">
      <aside className={`filters${filtersOpen ? " open" : ""}`}>
        <button type="button" className="filters-title" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((o) => !o)}>
          <Icon name="filter" /> Filtres <span className="filters-toggle"><Icon name="chevron" /></span>
        </button>
        <div className="filters-body">

        <label className="filter-search">
          <Icon name="search" />
          <input
            type="search"
            aria-label="Rechercher dans la boutique"
            placeholder="Nom, description, couleur…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
        </label>

        <details open>
          <summary>Catégories <Icon name="chevron" /></summary>
          <ul>
            {categories.map((c) => (
              <li key={c.id}>
                <button className={cat === c.id ? "on" : ""} onClick={() => { setCat(cat === c.id ? null : c.id); setPage(1); }}>
                  <CatIcon category={c} />
                  <span>{c.label}</span>
                  <em>{products.filter((p) => p.category === c.id).length}</em>
                </button>
              </li>
            ))}
          </ul>
        </details>

        {sizes.length > 0 && (
          <details open>
            <summary>Taille <Icon name="chevron" /></summary>
            <div className="chips filter-chips">
              {sizes.map((r) => (
                <button key={r.id} className={`chip${size === r.id ? " on" : ""}`} aria-pressed={size === r.id} onClick={() => { setSize(size === r.id ? null : r.id); setPage(1); }}>
                  {r.label}
                </button>
              ))}
            </div>
          </details>
        )}

        {colorTypes.length > 0 && (
          <details open>
            <summary>Type de couleur <Icon name="chevron" /></summary>
            <div className="chips filter-chips">
              {colorTypes.map((r) => (
                <button key={r.id} className={`chip${colorType === r.id ? " on" : ""}`} aria-pressed={colorType === r.id} onClick={() => { setColorType(colorType === r.id ? null : r.id); setPage(1); }}>
                  {r.label}
                </button>
              ))}
            </div>
          </details>
        )}

        {colors.length > 0 && (
          <details open>
            <summary>Couleur <Icon name="chevron" /></summary>
            <div className="chips filter-chips">
              {colors.map((c) => (
                <button key={c} className={`chip${color === c ? " on" : ""}`} aria-pressed={color === c} onClick={() => { setColor(color === c ? null : c); setPage(1); }}>
                  {c}
                </button>
              ))}
            </div>
          </details>
        )}

        <details open>
          <summary>Prix <Icon name="chevron" /></summary>
          <div className="radios">
            {priceRanges.map((r) => (
              <label key={r.id}>
                <input type="radio" name="price" checked={price === r.id} onChange={() => { setPrice(r.id); setPage(1); }} />
                <span>{r.label}</span>
              </label>
            ))}
          </div>
        </details>

        <details open>
          <summary>Disponibilité <Icon name="chevron" /></summary>
          <label className="stock">
            <input type="checkbox" checked={stockOnly} onChange={(e) => { setStockOnly(e.target.checked); setPage(1); }} />
            <span>En stock ({inStockCount})</span>
          </label>
        </details>

        <button className="btn reset" onClick={reset}><Icon name="refresh" /> Réinitialiser</button>
        </div>
      </aside>

      <div>
        <div className="toolbar">
          <span>
            {filtered.length ? `Affichage de ${from}–${to} sur ${filtered.length} produit${filtered.length > 1 ? "s" : ""}` : "Aucun produit"}
          </span>
          <div className="toolbar-right">
            <label>
              Trier par :
              <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
                {Object.entries(sorts).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </label>
            <button className={`view${view === "grid" ? " on" : ""}`} aria-label="Vue grille" aria-pressed={view === "grid"} onClick={() => setView("grid")}><Icon name="grid" /></button>
            <button className={`view${view === "list" ? " on" : ""}`} aria-label="Vue liste" aria-pressed={view === "list"} onClick={() => setView("list")}><Icon name="list" /></button>
          </div>
        </div>

        <ProductGrid items={slice} filterByQuery={false} className={`products-wide${view === "list" ? " as-list" : ""}`} />

        {pages > 1 && (
          <nav className="pagination" aria-label="Pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button key={n} className={n === current ? "on" : ""} aria-current={n === current ? "page" : undefined} onClick={() => setPage(n)}>{n}</button>
            ))}
            {current < pages && <button aria-label="Page suivante" onClick={() => setPage(current + 1)}>›</button>}
          </nav>
        )}
      </div>
    </div>
  );
}
