import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { api } from "@/lib/api";
import { requireUser } from "@/lib/session";
import { logout } from "@/app/actions/auth";

export const metadata: Metadata = { title: "Mon compte — ArtMadagascar", robots: { index: false } };

type Me = { nom?: string; prenom?: string; email: string; tel?: string; ville?: string };

async function Account() {
  const session = await requireUser("/compte");
  const me = (await api<{ data: Me }>(`/utilisateur/${session.id}`, { token: session.token })).data;
  const name = [me.prenom, me.nom].filter(Boolean).join(" ") || me.email;

  return (
    <>
      <div className="account-head">
        <div>
          <h2 className="about-h2">Bonjour {name}</h2>
          <p className="muted-small">{me.email}{me.tel ? ` · ${me.tel}` : ""}</p>
        </div>
        <div className="account-actions">
          {session.role === 1 && <Link className="btn" href="/admin">Administration</Link>}
          <form action={logout}><button className="btn btn-light" type="submit">Se déconnecter</button></form>
        </div>
      </div>
      <p>
        Vous avez passé une commande ? <Link className="text-link" href="/suivi">Suivez-la avec votre code de suivi →</Link>
      </p>
    </>
  );
}

export default function AccountPage() {
  return (
    <section className="section">
      <Suspense fallback={<p className="no-result">Chargement…</p>}>
        <Account />
      </Suspense>
    </section>
  );
}
