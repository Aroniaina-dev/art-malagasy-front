import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { getCategories, getColorTypes, getSizes, type ApiProduit } from "@/lib/catalog";
import { ProductForm } from "../../../components/AdminForms";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [types, sizes, colorTypes] = await Promise.all([getCategories(), getSizes(), getColorTypes()]);
  let a: ApiProduit;
  try {
    a = (await api<{ data: ApiProduit }>(`/produit/${encodeURIComponent(id)}`)).data;
  } catch (e) {
    if (e instanceof ApiError && [400, 404, 500].includes(e.status)) notFound();
    throw e;
  }
  return (
    <>
      <h1 className="admin-title">Modifier « {a.titre} »</h1>
      <ProductForm
        types={types}
        sizes={sizes}
        colorTypes={colorTypes}
        product={{
          id: a._id,
          titre: a.titre,
          description: a.description,
          prix: a.prix ?? null,
          nbrStock: a.nbrStock ?? 0,
          idTypeProduit: String(a.idTypeProduit),
          idTaille: String(a.idTaille),
          idTypeCouleur: String(a.idTypeCouleur),
          couleur: (a.couleur ?? []).join(", "),
        }}
      />
    </>
  );
}
