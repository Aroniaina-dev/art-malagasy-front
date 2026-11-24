import { getCategories, getProducts } from "@/lib/catalog";
import { requireAdmin } from "@/lib/session";
import AdminProductCatalogue from "../../components/AdminProductCatalogue";

export default async function AdminCataloguePage() {
  await requireAdmin();
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return <AdminProductCatalogue products={products} categories={categories} />;
}
