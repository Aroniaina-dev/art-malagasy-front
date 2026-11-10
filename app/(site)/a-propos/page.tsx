import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/app/components/Icons";

export const metadata: Metadata = {
  title: "À propos — ArtMadagascar",
  description: "Notre mission : faire connaître l'artisanat malgache et soutenir les artisans qui le font vivre.",
};

const values = [
  { icon: "heart", title: "Fait main", text: "Chaque pièce est façonnée à la main, sans production en série." },
  { icon: "shield", title: "Authenticité", text: "Nous travaillons directement avec les artisans et ateliers locaux." },
  { icon: "star", title: "Juste rémunération", text: "Une part équitable du prix revient à celles et ceux qui créent." },
  { icon: "truck", title: "Livraison soignée", text: "Vos articles sont emballés avec soin et livrés partout à Madagascar." },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">À propos</div>
        <h1>Un savoir-faire à <span>partager</span></h1>
        <p>ArtMadagascar met en lumière les talents des artisans malgaches et leurs créations réalisées avec passion.</p>
      </section>

      <section className="section">
        <div className="story-inner about-story">
          <div>
            <h2 className="about-h2">Notre histoire</h2>
            <p>ArtMadagascar est né d&apos;une envie simple : offrir aux artisans de l&apos;île une vitrine à la hauteur de leur talent. Vannerie en raphia, sculpture sur bois, bijoux en graines, textiles tissés : ces techniques se transmettent depuis des générations.</p>
            <p>En choisissant leurs créations, vous contribuez à préserver ce patrimoine et à faire vivre des communautés locales.</p>
            <Link className="btn" href="/boutique">Découvrir la boutique <Icon name="arrow" /></Link>
          </div>
          <div className="story-photo" role="img" aria-label="Ambiance artisanale et décoration naturelle" />
        </div>
      </section>

      <section className="section">
        <div className="section-heading"><h2>Nos engagements</h2></div>
        <div className="values">
          {values.map((v) => (
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
