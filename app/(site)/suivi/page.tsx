import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Suivre ma commande — ArtMadagascar" };

async function go(form: FormData) {
  "use server";
  const code = String(form.get("code") ?? "").trim();
  if (/^[a-f0-9]{48}$/i.test(code)) redirect(`/suivi/${code.toLowerCase()}`);
  redirect("/suivi?erreur=1");
}

export default function TrackPage() {
  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">Suivi</div>
        <h1>Suivre ma commande</h1>
        <p>Entrez le code de suivi reçu à la validation de votre commande.</p>
      </section>
      <section className="section auth-wrap">
        <form className="contact-form auth-form" action={go}>
          <label>Code de suivi<input name="code" required autoComplete="off" spellCheck={false} /></label>
          <button className="btn" type="submit">Rechercher</button>
        </form>
      </section>
    </>
  );
}
