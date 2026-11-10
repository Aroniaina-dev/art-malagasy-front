import Link from "next/link";
import { api } from "@/lib/api";
import { formatAr } from "@/lib/products";
import { requireAdmin } from "@/lib/session";

type Order = { status: string; paymentStatus: string; totalAmount: number };

export default async function AdminHome() {
  const { token } = await requireAdmin();
  const [orders, articles, messages, users] = await Promise.all([
    api<{ total: number; data: Order[] }>("/commandes?limit=100", { token }),
    api<{ data: { nbrStock?: number; archive?: number }[] }>("/article?limit=500"),
    api<{ nonLus: number }>("/messages", { token }),
    api<{ results: number }>("/utilisateur", { token }),
  ]);

  const active = articles.data.filter((a) => a.archive !== 1);
  const lowStock = active.filter((a) => (a.nbrStock ?? 0) <= 3).length;
  const inProgress = orders.data.filter((o) => o.paymentStatus !== "paid").length;
  const revenue = orders.data.filter((o) => o.paymentStatus === "paid").reduce((n, o) => n + o.totalAmount, 0);

  const cards = [
    { label: "Commandes à traiter", value: inProgress, href: "/admin/commandes", hot: inProgress > 0 },
    { label: "Messages non lus", value: messages.nonLus, href: "/admin/messages", hot: messages.nonLus > 0 },
    { label: "Produits (stock ≤ 3)", value: `${active.length} (${lowStock})`, href: "/admin/produits", hot: lowStock > 0 },
    { label: "Commandes au total", value: orders.total, href: "/admin/commandes" },
    { label: "Encaissé (100 dernières)", value: formatAr(revenue), href: "/admin/commandes" },
    { label: "Utilisateurs", value: users.results, href: "/admin/utilisateurs" },
  ];

  return (
    <>
      <h1 className="admin-title">Tableau de bord</h1>
      <div className="stat-grid">
        {cards.map((c) => (
          <Link className={`stat${c.hot ? " hot" : ""}`} href={c.href} key={c.label}>
            <span>{c.label}</span>
            <strong>{c.value}</strong>
          </Link>
        ))}
      </div>
    </>
  );
}
