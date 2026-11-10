import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ClearCart from "@/app/components/ClearCart";
import { api, ApiError } from "@/lib/api";
import { fill, href } from "@/lib/dictionaries";
import { getI18n } from "@/lib/i18n";
import { formatDate } from "@/lib/posts";
import { formatAr } from "@/lib/products";

export const metadata: Metadata = { robots: { index: false } };

type Track = {
  trackingCode: string;
  createdAt: string;
  status: "fabrication" | "envoi" | "payment";
  paymentStatus: "pending" | "paid";
  totalAmount: number;
  items: { titre: string; prixUnitaire: number; quantite: number; sousTotal: number }[];
  history: { status: string; note?: string; changedAt: string }[];
};

const steps = ["fabrication", "envoi", "payment"] as const;

type Props = { params: Promise<{ code: string }>; searchParams: Promise<{ merci?: string }> };

async function Tracking({ params, searchParams }: Props) {
  const { code } = await params;
  const { merci } = await searchParams;
  const { lang, d } = await getI18n();
  const t = d.track;

  let order: Track;
  try {
    order = (await api<{ data: Track }>(`/commandes/track/${encodeURIComponent(code)}`)).data;
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 400)) notFound();
    throw e;
  }
  const current = steps.indexOf(order.status);

  return (
    <div className="form-done tracking">
      {merci && <ClearCart />}
      {merci && (
        <>
          <h3>{t.thanks}</h3>
          <p><strong>{t.keep}</strong>{t.keepText}</p>
        </>
      )}
      <p className="track-code">{order.trackingCode}</p>
      <p className="muted-small">
        {fill(t.orderOf, { date: formatDate(order.createdAt, lang) })} · {t.payment} : {order.paymentStatus === "paid" ? t.paid : t.pending}
      </p>

      <ol className="steps">
        {steps.map((s, i) => (
          <li key={s} className={i < current || (i === current && (s !== "payment" || order.paymentStatus === "paid")) ? "done" : i === current ? "now" : ""}>
            {t.steps[s]}
          </li>
        ))}
      </ol>

      {/* Montants en ariary : c'est la devise réellement facturée par le back. */}
      <ul className="order-lines">
        {order.items.map((i, k) => (
          <li key={k}><span>{i.quantite} × {i.titre}</span><span>{formatAr(i.sousTotal)}</span></li>
        ))}
      </ul>
      <p><strong>{t.total} : {formatAr(order.totalAmount)}</strong></p>

      {order.history.length > 0 && (
        <ul className="history">
          {order.history.map((h, k) => (
            <li key={k}><small>{formatDate(h.changedAt, lang)}</small> {h.note ?? h.status}</li>
          ))}
        </ul>
      )}
      <Link className="btn" href={href(lang, "/boutique")}>{t.continue}</Link>
    </div>
  );
}

export default function TrackingPage(props: Props) {
  return (
    <section className="section auth-wrap">
      <Suspense fallback={<p className="no-result">…</p>}>
        <Tracking {...props} />
      </Suspense>
    </section>
  );
}
