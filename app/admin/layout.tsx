import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { requireAdmin } from "@/lib/session";
import { logout } from "../actions/auth";

export const metadata: Metadata = { title: "Administration — ArtMadagascar", robots: { index: false } };

const nav = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/utilisateurs", label: "Utilisateurs" },
];

async function Gate({ children }: { children: ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="admin">
      <aside className="admin-nav">
        <strong>Administration</strong>
        <small className="admin-user">{session.email}</small>
        {nav.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
        <Link href="/" className="admin-back">← Voir le site</Link>
        <form action={logout}>
          <button type="submit" className="admin-logout">Se déconnecter</button>
        </form>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-page">
      <Suspense fallback={<p className="section no-result">Chargement…</p>}>
        <Gate>{children}</Gate>
      </Suspense>
    </div>
  );
}
