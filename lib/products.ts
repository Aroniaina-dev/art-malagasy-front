/** Type de produit du back (sac, chapeau…) : c'est la « catégorie » de la boutique. */
export type Category = { id: string; label: string; slug: string };

/** Taille ou type de couleur. */
export type Ref = { id: string; label: string };

/** Libellés connus → slug servant aux illustrations /categories/<slug>.png. */
const knownSlugs: Record<string, string> = {
  "Sacs & Vannerie": "sacs",
  "Masques & Sculptures": "masques",
  Bijoux: "bijoux",
  Décoration: "deco",
  "Textiles Malgaches": "textiles",
  Souvenirs: "souvenirs",
  Cadeaux: "cadeaux",
};

export const categorySlug = (label: string) => knownSlugs[label];
export const hasCategoryImage = (label: string) => label in knownSlugs;

/** Produit tel que consommé par l'interface (sérialisable côté client). */
export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string; // id du type de produit
  size: string; // id de taille
  colorType: string; // id du type de couleur
  colors: string[];
  sizeLabel?: string;
  colorTypeLabel?: string;
  price: number | null; // null = « sur demande » (non commandable)
  stock: number;
  inStock: boolean;
};

export const formatAr = (n: number) => `${n.toLocaleString("fr-FR").replace(/[  ]/g, " ")} Ar`;

/** Les images externes autres qu'Unsplash ne passent pas par l'optimiseur de Next. */
export const isOptimizable = (src: string) => src.startsWith("/") || src.startsWith("https://images.unsplash.com/");
