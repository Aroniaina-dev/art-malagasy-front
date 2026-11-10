import Link from "next/link";
import { getCategories, getColorTypes, getSizes } from "@/lib/catalog";
import { ProductForm } from "../../../components/AdminForms";

export default async function NewProduct() {
  const [types, sizes, colorTypes] = await Promise.all([getCategories(), getSizes(), getColorTypes()]);
  const ready = types.length && sizes.length && colorTypes.length;
  return (
    <>
      <h1 className="admin-title">Nouveau produit</h1>
      {ready ? (
        <ProductForm types={types} sizes={sizes} colorTypes={colorTypes} />
      ) : (
        <p className="form-error">
          Créez d&apos;abord au moins un type de produit, une taille et un type de couleur dans{" "}
          <Link className="text-link" href="/admin/referentiels">Référentiels</Link>.
        </p>
      )}
    </>
  );
}
