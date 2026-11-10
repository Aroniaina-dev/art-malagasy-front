import "server-only";
import { api, fileUrl } from "./api";
import type { Post } from "./posts";
import type { Category, Product, Ref } from "./products";
import { categorySlug } from "./products";

type ApiRef = { _id: string; nom: string };
export type ApiProduit = {
  _id: string;
  titre: string;
  description: string;
  prix?: number;
  photos?: string[];
  idTypeProduit: string;
  idTaille: string;
  idTypeCouleur: string;
  couleur?: string[];
  nbrStock?: number;
  archive?: number;
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

const refs = async (path: string): Promise<Ref[]> => {
  const res = await api<{ data: ApiRef[] }>(path);
  if (!Array.isArray(res.data)) throw new Error(`Réponse inattendue de ${path}`);
  return res.data.map((r) => ({ id: r._id, label: r.nom })).sort((a, b) => a.label.localeCompare(b.label, "fr"));
};

/** Types de produit = catégories de la boutique. */
export async function getCategories(): Promise<Category[]> {
  return (await refs("/typeproduit")).map((r) => ({ ...r, slug: categorySlug(r.label) ?? "" }));
}
export const getSizes = () => refs("/taille");
export const getColorTypes = () => refs("/typecouleur");

export const toProduct = (a: ApiProduit): Product => {
  const stock = a.nbrStock ?? 0;
  return {
    id: a._id,
    name: a.titre,
    description: a.description,
    image: fileUrl(a.photos?.[0]),
    category: String(a.idTypeProduit),
    size: String(a.idTaille),
    colorType: String(a.idTypeCouleur),
    colors: a.couleur ?? [],
    price: typeof a.prix === "number" ? a.prix : null,
    stock,
    inStock: stock > 0,
  };
};

/** Produits visibles en boutique (les articles archivés sont masqués). */
/** Tous les produits, archivés compris (admin). */
export async function getAllProducts(): Promise<ApiProduit[]> {
  const res = await api<{ data: ApiProduit[] }>("/produit?limit=500&sort=-createdAt");
  if (!Array.isArray(res.data)) throw new Error("Réponse inattendue de /produit");
  return res.data;
}

/** Produits visibles en boutique (les produits archivés sont masqués). */
export async function getProducts(limit?: number): Promise<Product[]> {
  const [all, categories] = await Promise.all([getAllProducts(), getCategories().catch(() => [])]);
  const slugOf = new Map(categories.map((c) => [c.id, c.slug]));
  const list = all
    .filter((a) => a.archive !== 1)
    .map((a) => {
      const p = toProduct(a);
      const slug = slugOf.get(p.category);
      // sans photo : illustration du type de produit plutôt qu'une image générique
      return a.photos?.length || !slug ? p : { ...p, image: `/categories/${slug}.png` };
    });
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
  if (!Array.isArray(res.data)) throw new Error("Réponse inattendue de /blog");
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
