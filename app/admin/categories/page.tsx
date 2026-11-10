import { api } from "@/lib/api";
import { requireAdmin } from "@/lib/session";
import { createCategory, deleteCategory, renameCategory } from "../../actions/admin";
import AdminError from "../../components/AdminError";

type Cat = { _id: string; nom: string };

export default async function AdminCategories({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const { erreur } = await searchParams;
  await requireAdmin();
  const { data } = await api<{ data: Cat[] }>("/categorie");
  return (
    <>
      <h1 className="admin-title">Catégories ({data.length})</h1>
      <AdminError message={erreur} />
      <form action={createCategory} className="inline-form">
        <input name="nom" placeholder="Nouvelle catégorie" required />
        <button className="btn" type="submit">Ajouter</button>
      </form>
      <div className="table-wrap">
        <table className="admin-table">
          <tbody>
            {data.map((c) => (
              <tr key={c._id}>
                <td>
                  <form action={renameCategory} className="inline-form">
                    <input type="hidden" name="id" value={c._id} />
                    <input name="nom" defaultValue={c.nom} required />
                    <button className="linklike" type="submit">Renommer</button>
                  </form>
                </td>
                <td className="row-actions">
                  <form action={deleteCategory}>
                    <input type="hidden" name="id" value={c._id} />
                    <button className="linklike danger" type="submit">Supprimer</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted-small">Supprimer une catégorie ne supprime pas ses produits : pensez à les réaffecter.</p>
    </>
  );
}
