import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { api, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/posts";
import { formatAr } from "@/lib/products";
import ClearCart from "@/app/components/ClearCart";

export const metadata: Metadata = { title: "Suivi de commande — ArtMadagascar", robots: { index: false } };

type Track = {
  trackingCode: string;
  createdAt: string;
  status: "fabrication" | "envoi" | "payment";
  paymentStatus: "pending" | "paid";
  totalAmount: number;
  items: { titre: string; prixUnitaire: number; quantite: number; sousTotal: number }[];
  history: { status: string; note?: string; changedAt: string }[];
};

const steps = [
  { key: "fabrication", label: "Fabrication" },
  { key: "envoi", label: "Envoi" },
  { key: "payment", label: "Paiement" },
] as const;

async function Tracking({ params, searchParams }: { params: Promise<{ code: string }>; searchParams: Promise<{ merci?: string }> }) {
  const { code } = await params;
  const { merci } = await searchParams;

  let order: Track;
  try {
    order = (await api<{ data: Track }>(`/commandes/track/${encodeURIComponent(code)}`)).data;
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 400)) notFound();
    throw e;
  }
  const current = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="form-done tracking">
      {merci && <ClearCart />}
      {merci && (
        <>
          <h3>Merci ! Votre commande est enregistrée.</h3>
          <p><strong>Conservez ce code</strong> : c&apos;est le seul moyen de suivre votre commande.</p>
        </>
      )}
      <p className="track-code">{order.trackingCode}</p>
      <p className="muted-small">Commande du {formatDate(order.createdAt)} · Paiement : {order.paymentStatus === "paid" ? "reçu" : "en attente"}</p>

      <ol className="steps">
        {steps.map((s, i) => (
          <li key={s.key} className={i < current || (i === current && (s.key !== "payment" || order.paymentStatus === "paid")) ? "done" : i === current ? "now" : ""}>
            {s.label}
          </li>
        ))}
      </ol>

      <ul className="order-lines">
        {order.items.map((i, k) => (
          <li key={k}><span>{i.quantite} × {i.titre}</span><span>{formatAr(i.sousTotal)}</span></li>
        ))}
      </ul>
      <p><strong>Total : {formatAr(order.totalAmount)}</strong></p>

      {order.history.length > 0 && (
        <ul className="history">
          {order.history.map((h, k) => (
            <li key={k}><small>{formatDate(h.changedAt)}</small> {h.note ?? h.status}</li>
          ))}
        </ul>
      )}
      <Link className="btn" href="/boutique">Continuer mes achats</Link>
    </div>
  );
}

export default function TrackingPage(props: { params: Promise<{ code: string }>; searchParams: Promise<{ merci?: string }> }) {
  return (
    <section className="section auth-wrap">
      <Suspense fallback={<p className="no-result">Chargement…</p>}>
        <Tracking {...props} />
      </Suspense>
    </section>
  );
}
