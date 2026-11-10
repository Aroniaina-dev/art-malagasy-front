import { api } from "@/lib/api";
import { formatDate } from "@/lib/posts";
import { requireAdmin } from "@/lib/session";
import { deleteMessage, setMessageRead } from "../../actions/admin";
import AdminError from "../../components/AdminError";

type Msg = { _id: string; nom: string; email: string; sujet: string; message: string; lu: boolean; createdAt: string };

const subjects: Record<string, string> = { commande: "Commande", produit: "Produit", livraison: "Livraison & retours", autre: "Autre" };

export default async function AdminMessages({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const { erreur } = await searchParams;
  const { token } = await requireAdmin();
  const { data, nonLus } = await api<{ data: Msg[]; nonLus: number }>("/messages", { token });
  return (
    <>
      <h1 className="admin-title">Messages ({data.length}, {nonLus} non lu{nonLus > 1 ? "s" : ""})</h1>
      <AdminError message={erreur} />
      <div className="orders">
        {data.map((m) => (
          <div className={`order-card${m.lu ? "" : " unread"}`} key={m._id}>
            <div className="order-top">
              <strong>{m.nom} · <a className="text-link" href={`mailto:${m.email}`}>{m.email}</a></strong>
              <small>{subjects[m.sujet] ?? m.sujet} · {formatDate(m.createdAt)}</small>
            </div>
            <p className="msg-body">{m.message}</p>
            <div className="row-actions">
              <form action={setMessageRead}>
                <input type="hidden" name="id" value={m._id} />
                <input type="hidden" name="lu" value={m.lu ? "false" : "true"} />
                <button className="linklike" type="submit">{m.lu ? "Marquer non lu" : "Marquer lu"}</button>
              </form>
              <form action={deleteMessage}>
                <input type="hidden" name="id" value={m._id} />
                <button className="linklike danger" type="submit">Supprimer</button>
              </form>
            </div>
          </div>
        ))}
        {!data.length && <p className="no-result">Aucun message.</p>}
      </div>
    </>
  );
}
