import "server-only";
import { api, fileUrl } from "./api";
import type { Post } from "./posts";
import type { Category, Product } from "./products";
import { categorySlug } from "./products";

type ApiCategory = { _id: string; nom: string; archive?: number };
type ApiArticle = {
  _id: string;
  titre: string;
  description: string;
  prix?: number;
  photos?: string[];
  idCategorie: string;
  nbrStock?: number;
  isVendu?: number;
  archive?: number;
  couleur?: string;
  ville?: string;
};
type ApiBlog = {
  _id: string;
  titre: string;
  slug: string;
  resume: string;
  contenu?: string;
  image: string;
  tempsLecture?: string;
  publie: boolean;
  datePublication: string;
};

export async function getCategories(): Promise<Category[]> {
  const res = await api<{ data: ApiCategory[] }>("/categorie");
  return res.data
    .filter((c) => c.archive !== 1)
    .map((c) => ({ id: c._id, label: c.nom, slug: categorySlug(c.nom) ?? "" }));
}

export const toProduct = (a: ApiArticle): Product => {
  const stock = a.nbrStock ?? 0;
  return {
    id: a._id,
    name: a.titre,
    description: a.description,
    image: fileUrl(a.photos?.[0]),
    category: String(a.idCategorie),
    price: typeof a.prix === "number" ? a.prix : null,
    stock,
    inStock: a.isVendu !== 1 && stock > 0,
  };
};

/** Produits visibles en boutique (les articles archivés sont masqués). */
export async function getProducts(limit?: number): Promise<Product[]> {
  const res = await api<{ data: ApiArticle[] }>("/article?limit=200&sort=-createdAt");
  const list = res.data.filter((a) => a.archive !== 1).map(toProduct);
  return limit ? list.slice(0, limit) : list;
}

const toPost = (b: ApiBlog): Post => ({
  id: b._id,
  slug: b.slug,
  title: b.titre,
  excerpt: b.resume,
  image: fileUrl(b.image),
  readTime: b.tempsLecture ?? "3 min",
  date: b.datePublication,
  published: b.publie,
  body: b.contenu,
});

export async function getPosts(): Promise<Post[]> {
  const res = await api<{ data: ApiBlog[] }>("/blog?limit=100");
  return res.data.map(toPost);
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await api<{ data: ApiBlog }>(`/blog/${encodeURIComponent(slug)}`);
    return toPost(res.data);
  } catch (e) {
    if (e instanceof Error && "status" in e && (e as { status: number }).status === 404) return null;
    throw e;
  }
}

/**
 * Pour les pages publiques : si l'API est injoignable ou répond de travers, on renvoie null
 * (la page affiche un message) au lieu de faire planter toute la page.
 */
export async function safe<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (e) {
    console.error("[api] chargement impossible :", e instanceof Error ? e.message : e);
    return null;
  }
}
