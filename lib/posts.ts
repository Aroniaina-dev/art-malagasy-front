export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  date: string;
  published: boolean;
  body?: string;
};

export const formatDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/** Le contenu est du texte brut : un paragraphe par bloc séparé par une ligne vide. */
export const toParagraphs = (body: string) =>
  body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
