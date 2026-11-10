import Link from "next/link";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/posts";
import { requireAdmin } from "@/lib/session";
import { deletePost } from "../../actions/admin";
import AdminError from "../../components/AdminError";

type Blog = { _id: string; titre: string; publie: boolean; datePublication: string };

export default async function AdminBlog({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const { erreur } = await searchParams;
  const { token } = await requireAdmin();
  const { data } = await api<{ data: Blog[] }>("/blog/admin/all", { token });
  return (
    <>
      <div className="admin-bar">
        <h1 className="admin-title">Blog ({data.length})</h1>
        <Link className="btn" href="/admin/blog/nouveau">Nouvel article</Link>
      </div>
      <AdminError message={erreur} />
      <div className="table-wrap">
        <table className="admin-table">
          <thead><tr><th>Titre</th><th>Date</th><th>Statut</th><th /></tr></thead>
          <tbody>
            {data.map((p) => (
              <tr key={p._id}>
                <td>{p.titre}</td>
                <td>{formatDate(p.datePublication)}</td>
                <td>{p.publie ? "Publié" : "Brouillon"}</td>
                <td className="row-actions">
                  <Link className="text-link" href={`/admin/blog/${p._id}`}>Modifier</Link>
                  <form action={deletePost}>
                    <input type="hidden" name="id" value={p._id} />
                    <button className="linklike danger" type="submit">Supprimer</button>
                  </form>
                </td>
              </tr>
            ))}
            {!data.length && <tr><td colSpan={4}>Aucun article.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
