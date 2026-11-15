import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/app/components/Icons";
import { href } from "@/lib/dictionaries";
import { getI18n } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n();
  return { title: d.about.meta, description: d.about.intro };
}

export default async function AboutPage() {
  const { lang, d } = await getI18n();
  const a = d.about;
  return (
    <>
      <section className="page-hero about-hero">
        <div className="eyebrow">{a.eyebrow}</div>
        <h1>{a.title1} <span>{a.title2}</span></h1>
        <p>{a.intro}</p>
      </section>

      <section className="band band-white story-band">
        <div className="story-visual about-visual" role="img" aria-label={a.range[1].alt} />
        <div className="story-copy">
          <span className="section-kicker">{a.storyKicker}</span>
          <h2>{a.storyTitle}</h2>
          <p>{a.story1}</p>
          <p>{a.story2}</p>
          <p>{a.story3}</p>
          <Link className="btn" href={href(lang, "/boutique")}>{a.cta} <Icon name="arrow" /></Link>
        </div>
      </section>

      <section className="band band-sand">
        <div className="section-head">
          <span className="section-kicker">{a.rangeKicker}</span>
          <h2>{a.rangeTitle}</h2>
        </div>
        <div className="range-grid">
          {a.range.map((r) => (
            <article className="range-card" key={r.key}>
              <div className={`range-photo range-${r.key}`} role="img" aria-label={r.alt} />
              <div className="range-copy">
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="band band-cream">
        <div className="section-head">
          <span className="section-kicker">{a.stepsKicker}</span>
          <h2>{a.stepsTitle}</h2>
        </div>
        <ol className="craft-steps">
          {a.steps.map((s, i) => (
            <li key={s.title}>
              <span className="craft-num">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="band band-white">
        <div className="section-head">
          <h2>{a.valuesTitle}</h2>
        </div>
        <div className="values">
          {a.values.map((v) => (
            <div className="value" key={v.title}>
              <span className="symbol"><Icon name={v.icon} /></span>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="contact-band">
        <h2>{a.endTitle}</h2>
        <p>{a.endText}</p>
        <Link className="btn" href={href(lang, "/contact")}>{a.endCta} <Icon name="arrow" /></Link>
      </section>
    </>
  );
}
