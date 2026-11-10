import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isLang } from "@/lib/dictionaries";
import { getI18n } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n();
  return { title: d.track.meta };
}

async function go(form: FormData) {
  "use server";
  const l = String(form.get("lang") ?? "");
  const lang = isLang(l) ? l : "fr";
  const code = String(form.get("code") ?? "").trim();
  // le back génère 48 caractères hexadécimaux
  redirect(/^[a-f0-9]{48}$/i.test(code) ? `/${lang}/suivi/${code.toLowerCase()}` : `/${lang}/suivi`);
}

export default async function TrackPage() {
  const { lang, d } = await getI18n();
  const t = d.track;
  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">{t.eyebrow}</div>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </section>
      <section className="section auth-wrap">
        <form className="contact-form auth-form" action={go}>
          <input type="hidden" name="lang" value={lang} />
          <label>{t.code}<input name="code" required autoComplete="off" spellCheck={false} /></label>
          <button className="btn" type="submit">{t.search}</button>
        </form>
      </section>
    </>
  );
}
