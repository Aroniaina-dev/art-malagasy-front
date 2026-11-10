import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { getCategories } from "@/lib/catalog";
import { ProductForm } from "../../../components/AdminForms";

type Article = { _id: string; titre: string; description: string; prix?: number; nbrStock?: number; idCategorie: string; ville?: string; couleur?: string };

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const categories = await getCategories();
  let a: Article;
  try {
    a = (await api<{ data: Article }>(`/article/${encodeURIComponent(id)}`)).data;
  } catch (e) {
    if (e instanceof ApiError && [400, 404, 500].includes(e.status)) notFound();
    throw e;
  }
  return (
    <>
      <h1 className="admin-title">Modifier « {a.titre} »</h1>
      <ProductForm
        categories={categories}
        product={{
          id: a._id,
          titre: a.titre,
          description: a.description,
          prix: a.prix ?? null,
          nbrStock: a.nbrStock ?? 0,
          idCategorie: String(a.idCategorie),
          ville: a.ville ?? "",
          couleur: a.couleur ?? "",
        }}
      />
    </>
  );
}
