import { getCategories, getColorTypes, getSizes } from "@/lib/catalog";
import type { Ref } from "@/lib/products";
import { requireAdmin } from "@/lib/session";
import { createRef, deleteRef, renameRef } from "../../actions/admin";
import AdminError from "../../components/AdminError";

function RefList({ title, kind, items, placeholder }: { title: string; kind: string; items: Ref[]; placeholder: string }) {
  return (
    <section className="ref-block">
      <h2 className="ref-title">{title} ({items.length})</h2>
      <form action={createRef} className="inline-form">
        <input type="hidden" name="kind" value={kind} />
        <input name="nom" placeholder={placeholder} required />
        <button className="btn" type="submit">Ajouter</button>
      </form>
      <div className="table-wrap">
        <table className="admin-table">
          <tbody>
            {items.map((r) => (
              <tr key={r.id}>
                <td>
                  <form action={renameRef} className="inline-form">
                    <input type="hidden" name="kind" value={kind} />
                    <input type="hidden" name="id" value={r.id} />
                    <input name="nom" defaultValue={r.label} required />
                    <button className="linklike" type="submit">Renommer</button>
                  </form>
                </td>
                <td className="row-actions">
                  <form action={deleteRef}>
                    <input type="hidden" name="kind" value={kind} />
                    <input type="hidden" name="id" value={r.id} />
                    <button className="linklike danger" type="submit">Supprimer</button>
                  </form>
                </td>
              </tr>
            ))}
            {!items.length && <tr><td>Aucun élément.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default async function AdminRefs({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const { erreur } = await searchParams;
  await requireAdmin();
  const [types, sizes, colorTypes] = await Promise.all([getCategories(), getSizes(), getColorTypes()]);
  return (
    <>
      <h1 className="admin-title">Référentiels</h1>
      <p className="muted-small">Chaque produit doit avoir un type, une taille et un type de couleur. Supprimer un élément ne modifie pas les produits qui l&apos;utilisent : réaffectez-les d&apos;abord.</p>
      <AdminError message={erreur} />
      <div className="ref-grid">
        <RefList title="Types de produit" kind="typeproduit" items={types} placeholder="ex. Sacs & Vannerie" />
        <RefList title="Tailles" kind="taille" items={sizes} placeholder="ex. Moyen" />
        <RefList title="Types de couleur" kind="typecouleur" items={colorTypes} placeholder="ex. Naturel" />
      </div>
    </>
  );
}
