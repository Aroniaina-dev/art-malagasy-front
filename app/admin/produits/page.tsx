import Link from "next/link";
import { fileUrl } from "@/lib/api";
import { getAllProducts, getCategories, getSizes } from "@/lib/catalog";
import { formatAr } from "@/lib/products";
import { requireAdmin } from "@/lib/session";
import { deleteProduct, setProductArchive } from "../../actions/admin";
import AdminError from "../../components/AdminError";

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const { erreur } = await searchParams;
  await requireAdmin();
  const [data, types, sizes] = await Promise.all([getAllProducts(), getCategories(), getSizes()]);
  const type = (id: string) => types.find((c) => c.id === String(id));
  const size = (id: string) => sizes.find((c) => c.id === String(id))?.label ?? "Non défini";

  return (
    <>
      <div className="admin-bar">
        <h1 className="admin-title">Produits ({data.length})</h1>
        <Link className="btn" href="/admin/produits/nouveau">Ajouter un produit</Link>
      </div>
      <AdminError message={erreur} />
      <div className="table-wrap">
        <table className="admin-table">
          <thead><tr><th /><th>Titre</th><th>Type</th><th>Taille</th><th>Prix</th><th>Stock</th><th>Statut</th><th /></tr></thead>
          <tbody>
            {data.map((a) => {
              const t = type(a.idTypeProduit);
              const img = a.photos?.length ? fileUrl(a.photos[0]) : t?.slug ? `/categories/${t.slug}.png` : "/hero.png";
              return (
                <tr key={a._id} className={a.archive === 1 ? "muted-row" : ""}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <td><img className="thumb" src={img} alt="" width={44} height={44} /></td>
                  <td>{a.titre}{!a.photos?.length && <small className="warn"> (sans photo)</small>}</td>
                  <td>{t?.label ?? "Non défini"}</td>
                  <td>{size(a.idTaille)}</td>
                  <td>{typeof a.prix === "number" ? formatAr(a.prix) : "Non défini"}</td>
                  <td className={(a.nbrStock ?? 0) === 0 ? "bad" : (a.nbrStock ?? 0) <= 3 ? "warn" : ""}>{a.nbrStock ?? 0}</td>
                  <td>{a.archive === 1 ? "Archivé" : "En ligne"}</td>
                  <td className="row-actions">
                    <Link className="text-link" href={`/admin/produits/${a._id}`}>Modifier</Link>
                    <form action={setProductArchive}>
                      <input type="hidden" name="id" value={a._id} />
                      <input type="hidden" name="archive" value={a.archive === 1 ? "2" : "1"} />
                      <button className="linklike" type="submit">{a.archive === 1 ? "Remettre en ligne" : "Archiver"}</button>
                    </form>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={a._id} />
                      <button className="linklike danger" type="submit">Supprimer</button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {!data.length && <tr><td colSpan={8}>Aucun produit.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
