import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { logout } from "@/app/actions/auth";
import { api } from "@/lib/api";
import { fill, href } from "@/lib/dictionaries";
import { getI18n } from "@/lib/i18n";
import { requireUser } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n();
  return { title: d.account.meta, robots: { index: false } };
}

type Me = { nom?: string; prenom?: string; email: string; tel?: string };

async function Account() {
  const { lang, d } = await getI18n();
  const session = await requireUser(`/${lang}/compte`);
  const me = (await api<{ data: Me }>(`/utilisateur/${session.id}`, { token: session.token })).data;
  const name = [me.prenom, me.nom].filter(Boolean).join(" ") || me.email;

  return (
    <>
      <div className="account-head">
        <div>
          <h2 className="about-h2">{fill(d.account.hello, { name })}</h2>
          <p className="muted-small">{me.email}{me.tel ? ` · ${me.tel}` : ""}</p>
        </div>
        <div className="account-actions">
          {session.role === 1 && <Link className="btn" href="/admin">{d.account.admin}</Link>}
          <form action={logout}>
            <input type="hidden" name="lang" value={lang} />
            <button className="btn btn-light" type="submit">{d.account.logout}</button>
          </form>
        </div>
      </div>
      <p>
        {d.account.ordered} <Link className="text-link" href={href(lang, "/suivi")}>{d.account.trackLink}</Link>
      </p>
    </>
  );
}

export default async function AccountPage() {
  const { d } = await getI18n();
  return (
    <section className="section">
      <Suspense fallback={<p className="no-result">{d.common.loading}</p>}>
        <Account />
      </Suspense>
    </section>
  );
}
