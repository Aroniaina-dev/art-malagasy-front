"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { fill, label } from "@/lib/dictionaries";
import { hasCategoryImage, type Category, type Product, type Ref } from "@/lib/products";
import { useI18n } from "./I18nProvider";
import { Icon } from "./Icons";
import ProductGrid from "./ProductGrid";
import { useShop } from "./ShopProvider";

const PAGE_SIZE = 8;

// Les tranches sont exprimées en ariary (prix de référence du back).
const priceRanges = [
  { id: "lt20", key: "priceLt20", test: (p: Product) => p.price !== null && p.price < 20000 },
  { id: "20-50", key: "price20to50", test: (p: Product) => p.price !== null && p.price >= 20000 && p.price <= 50000 },
  { id: "50-100", key: "price50to100", test: (p: Product) => p.price !== null && p.price > 50000 && p.price <= 100000 },
  { id: "gt100", key: "priceGt100", test: (p: Product) => p.price !== null && p.price > 100000 },
] as const;

const sorts = {
  recent: { key: "sortRecent", fn: () => 0 }, // l'API renvoie déjà les plus récents d'abord (tri stable)
  asc: { key: "sortAsc", fn: (a: Product, b: Product) => (a.price ?? Infinity) - (b.price ?? Infinity) },
  desc: { key: "sortDesc", fn: (a: Product, b: Product) => (b.price ?? -1) - (a.price ?? -1) },
} as const;
type SortKey = keyof typeof sorts;

function CatIcon({ category }: { category: Category }) {
  if (!category.slug || !hasCategoryImage(category.label)) return <span className="cat-icon" style={{ width: 24, height: 24 }} />;
  return <Image className="cat-icon" src={`/categories/${category.slug}.png`} alt="" width={24} height={24} />;
}

type Props = { products: Product[]; categories: Category[]; sizes: Ref[]; colorTypes: Ref[] };

export default function Catalog({ products, categories, sizes, colorTypes }: Props) {
  const { query, setQuery } = useShop();
  const { d } = useI18n();
  const s = d.shop;
  const [cat, setCat] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [colorType, setColorType] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [stockOnly, setStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("recent");
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
    // la recherche porte aussi sur les libellés traduits (ex. « red » trouve « rouge »)
    const haystack = (p: Product) =>
      [p.name, p.description, ...p.colors, ...p.colors.map((c) => label(d, c))].join(" ").toLocaleLowerCase("fr");
    return products
      .filter((p) => (!cat || p.category === cat) && (!size || p.size === size) && (!colorType || p.colorType === colorType))
      .filter((p) => !color || p.colors.some((c) => c.toLocaleLowerCase("fr") === color))
      .filter((p) => (!range || range.test(p)) && (!stockOnly || p.inStock))
      .filter((p) => haystack(p).includes(term))
      .sort(sorts[sort].fn);
  }, [products, cat, size, colorType, color, price, stockOnly, term, sort, d]);

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

  const chips = (title: string, items: { id: string; label: string }[], value: string | null, set: (v: string | null) => void) =>
    items.length > 0 && (
      <details open>
        <summary>{title} <Icon name="chevron" /></summary>
        <div className="chips filter-chips">
          {items.map((r) => (
            <button key={r.id} className={`chip${value === r.id ? " on" : ""}`} aria-pressed={value === r.id} onClick={() => { set(value === r.id ? null : r.id); setPage(1); }}>
              {label(d, r.label)}
            </button>
          ))}
        </div>
      </details>
    );

  return (
    <div className="shop-layout">
      <aside className={`filters${filtersOpen ? " open" : ""}`}>
        <button type="button" className="filters-title" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((o) => !o)}>
          <Icon name="filter" /> {s.filters} <span className="filters-toggle"><Icon name="chevron" /></span>
        </button>
        <div className="filters-body">
          <label className="filter-search">
            <Icon name="search" />
            <input type="search" aria-label={s.searchLabel} placeholder={s.searchPlaceholder} value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
          </label>

          <details open>
            <summary>{s.categories} <Icon name="chevron" /></summary>
            <ul>
              {categories.map((c) => (
                <li key={c.id}>
                  <button className={cat === c.id ? "on" : ""} onClick={() => { setCat(cat === c.id ? null : c.id); setPage(1); }}>
                    <CatIcon category={c} />
                    <span>{label(d, c.label)}</span>
                    <em>{products.filter((p) => p.category === c.id).length}</em>
                  </button>
                </li>
              ))}
            </ul>
          </details>

          {chips(s.size, sizes, size, setSize)}
          {chips(s.colorType, colorTypes, colorType, setColorType)}
          {chips(s.color, colors.map((c) => ({ id: c, label: c })), color, setColor)}

          <details open>
            <summary>{s.price} <Icon name="chevron" /></summary>
            <div className="radios">
              {priceRanges.map((r) => (
                <label key={r.id}>
                  <input type="radio" name="price" checked={price === r.id} onChange={() => { setPrice(r.id); setPage(1); }} />
                  <span>{s[r.key]}</span>
                </label>
              ))}
            </div>
          </details>

          <details open>
            <summary>{s.availability} <Icon name="chevron" /></summary>
            <label className="stock">
              <input type="checkbox" checked={stockOnly} onChange={(e) => { setStockOnly(e.target.checked); setPage(1); }} />
              <span>{s.inStock} ({inStockCount})</span>
            </label>
          </details>

          <button className="btn reset" onClick={reset}><Icon name="refresh" /> {s.reset}</button>
        </div>
      </aside>

      <div>
        <div className="toolbar">
          <span>
            {filtered.length
              ? `${fill(s.showing, { from, to, total: filtered.length })} ${filtered.length > 1 ? s.products : s.product}`
              : s.none}
          </span>
          <div className="toolbar-right">
            <label>
              {s.sortBy}
              <select value={sort} onChange={(e) => { setSort(e.target.value as SortKey); setPage(1); }}>
                {(Object.keys(sorts) as SortKey[]).map((k) => <option key={k} value={k}>{s[sorts[k].key]}</option>)}
              </select>
            </label>
            <button className={`view${view === "grid" ? " on" : ""}`} aria-label={s.grid} aria-pressed={view === "grid"} onClick={() => setView("grid")}><Icon name="grid" /></button>
            <button className={`view${view === "list" ? " on" : ""}`} aria-label={s.list} aria-pressed={view === "list"} onClick={() => setView("list")}><Icon name="list" /></button>
          </div>
        </div>

        <ProductGrid items={slice} filterByQuery={false} className={`products-wide${view === "list" ? " as-list" : ""}`} />

        {pages > 1 && (
          <nav className="pagination" aria-label={s.pagination}>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button key={n} className={n === current ? "on" : ""} aria-current={n === current ? "page" : undefined} onClick={() => setPage(n)}>{n}</button>
            ))}
            {current < pages && <button aria-label={s.next} onClick={() => setPage(current + 1)}>›</button>}
          </nav>
        )}
      </div>
    </div>
  );
}
