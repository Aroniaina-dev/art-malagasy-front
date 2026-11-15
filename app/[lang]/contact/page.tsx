import type { Metadata } from "next";
import ContactForm from "@/app/components/ContactForm";
import { Icon } from "@/app/components/Icons";
import { getI18n } from "@/lib/i18n";
import { EMAIL, PHONE } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n();
  return { title: d.contact.meta, description: d.contact.intro };
}

export default async function ContactPage() {
  const { d } = await getI18n();
  const c = d.contact;
  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">{c.eyebrow}</div>
        <h1>{c.title}</h1>
        <p>{c.intro}</p>
      </section>
      <section className="section">
        <div className="contact-layout">
          <ContactForm />
          <aside className="contact-info">
            <h3>{c.details}</h3>
            <p><Icon name="phone" /> {PHONE}</p>
            <p><Icon name="user" /> {EMAIL}</p>
            <p><Icon name="truck" /> Madagascar</p>
            <p className="muted">{c.hours}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
