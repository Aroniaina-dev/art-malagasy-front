import type { LegalDoc } from "@/lib/legal";

/** Mise en page commune aux CGV et aux CGU. */
export default function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <section className="page-hero">
        <h1>{doc.title}</h1>
        <p>{doc.intro}</p>
      </section>
      <article className="section legal">
        <p className="legal-updated">{doc.updated}</p>
        {doc.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p.map((text, i) => <p key={i}>{text}</p>)}
          </section>
        ))}
      </article>
    </>
  );
}
