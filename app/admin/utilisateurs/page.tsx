import { api } from "@/lib/api";
import { formatDate } from "@/lib/posts";
import { requireAdmin } from "@/lib/session";

type User = { _id: string; nom?: string; prenom?: string; email: string; role: number; createdAt: string; archive?: number };

export default async function AdminUsers() {
  const { token } = await requireAdmin();
  const { data } = await api<{ data: User[] }>("/utilisateur", { token });
  return (
    <>
      <h1 className="admin-title">Utilisateurs ({data.length})</h1>
      <div className="table-wrap">
        <table className="admin-table">
          <thead><tr><th>Nom</th><th>Email</th><th>Inscrit le</th><th>Rôle</th></tr></thead>
          <tbody>
            {data.map((u) => (
              <tr key={u._id}>
                <td>{[u.prenom, u.nom].filter(Boolean).join(" ") || "—"}</td>
                <td>{u.email}</td>
                <td>{formatDate(u.createdAt)}</td>
                <td>{u.role === 1 ? <span className="badge badge-confirmed">Admin</span> : "Client"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted-small">Lecture seule : le back n&apos;expose pas encore de changement de rôle sécurisé.</p>
    </>
  );
}
