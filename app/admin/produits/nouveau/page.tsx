import { getCategories } from "@/lib/catalog";
import { ProductForm } from "../../../components/AdminForms";

export default async function NewProduct() {
  const categories = await getCategories();
  return (
    <>
      <h1 className="admin-title">Nouveau produit</h1>
      {categories.length ? <ProductForm categories={categories} /> : <p className="form-error">Créez d&apos;abord une catégorie.</p>}
    </>
  );
}
