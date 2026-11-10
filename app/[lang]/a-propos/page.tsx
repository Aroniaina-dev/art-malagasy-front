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
      <section className="page-hero">
        <div className="eyebrow">{a.eyebrow}</div>
        <h1>{a.title1} <span>{a.title2}</span></h1>
        <p>{a.intro}</p>
      </section>

      <section className="section">
        <div className="story-inner about-story">
          <div>
            <h2 className="about-h2">{a.storyTitle}</h2>
            <p>{a.story1}</p>
            <p>{a.story2}</p>
            <Link className="btn" href={href(lang, "/boutique")}>{a.cta} <Icon name="arrow" /></Link>
          </div>
          <div className="story-photo" role="img" aria-label={d.home.storyAlt} />
        </div>
      </section>

      <section className="section">
        <div className="section-heading"><h2>{a.valuesTitle}</h2></div>
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
    </>
  );
}
