import { api } from "@/lib/api";
import { formatDate } from "@/lib/posts";
import { formatAr } from "@/lib/products";
import { requireAdmin } from "@/lib/session";
import { advanceOrder, confirmPayment } from "../../actions/admin";
import AdminError from "../../components/AdminError";

type Order = {
  _id: string;
  trackingCode: string;
  createdAt: string;
  status: "fabrication" | "envoi" | "payment";
  paymentStatus: "pending" | "paid";
  totalAmount: number;
  customer: { nom: string; prenom: string; telephone: string; email?: string; adresse: string; ville: string; instructions?: string };
  items: { titre: string; quantite: number; sousTotal: number }[];
};

const stepLabel = { fabrication: "Fabrication", envoi: "Envoi", payment: "Paiement" } as const;
const nextStep = { fabrication: "envoi", envoi: "payment" } as const;

export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const { erreur } = await searchParams;
  const { token } = await requireAdmin();
  const { data, total } = await api<{ data: Order[]; total: number }>("/commandes?limit=100", { token });

  return (
    <>
      <h1 className="admin-title">Commandes ({total})</h1>
      <AdminError message={erreur} />
      <p className="muted-small">Étapes : Fabrication → Envoi → Paiement, puis confirmation du paiement reçu. Le stock n&apos;est pas décrémenté automatiquement.</p>
      <div className="orders">
        {data.map((o) => {
          const next = o.status !== "payment" ? nextStep[o.status] : null;
          return (
            <details className="order-card" key={o._id}>
              <summary>
                <strong>#{o._id.slice(-6).toUpperCase()}</strong>
                <span>{o.customer.prenom} {o.customer.nom}</span>
                <span>{formatDate(o.createdAt)}</span>
                <strong>{formatAr(o.totalAmount)}</strong>
                <span className={`badge badge-${o.paymentStatus === "paid" ? "delivered" : o.status}`}>
                  {o.paymentStatus === "paid" ? "Payée" : stepLabel[o.status]}
                </span>
              </summary>
              <ul className="order-lines">
                {o.items.map((i, k) => <li key={k}><span>{i.quantite} × {i.titre}</span><span>{formatAr(i.sousTotal)}</span></li>)}
              </ul>
              <p className="muted-small">
                {o.customer.adresse}, {o.customer.ville} · {o.customer.telephone}{o.customer.email ? ` · ${o.customer.email}` : ""}
                {o.customer.instructions ? <><br />Instructions : {o.customer.instructions}</> : null}
                <br />Code de suivi : {o.trackingCode}
              </p>
              <div className="status-form">
                {next && (
                  <form action={advanceOrder} className="inline-form">
                    <input type="hidden" name="id" value={o._id} />
                    <input type="hidden" name="status" value={next} />
                    <input name="note" placeholder="Note (facultatif)" />
                    <button className="btn" type="submit">Passer à « {stepLabel[next]} »</button>
                  </form>
                )}
                {o.status === "payment" && o.paymentStatus !== "paid" && (
                  <form action={confirmPayment} className="inline-form">
                    <input type="hidden" name="id" value={o._id} />
                    <input name="note" placeholder="Note (ex. virement reçu)" />
                    <button className="btn" type="submit">Confirmer le paiement</button>
                  </form>
                )}
                {o.paymentStatus === "paid" && <span className="muted-small">Commande terminée.</span>}
              </div>
            </details>
          );
        })}
        {!data.length && <p className="no-result">Aucune commande.</p>}
      </div>
    </>
  );
}
