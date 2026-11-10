import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/app/components/SiteShell";
import { dictionaries, isLang, locales } from "@/lib/dictionaries";
import { fontClasses } from "../fonts";
import "../globals.css";
import "../shop.css";

// Une version statique par langue : /fr/... et /en/...
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const d = dictionaries[lang];
  return {
    title: d.meta.title,
    description: d.meta.description,
    alternates: { languages: { fr: "/fr", en: "/en" } },
  };
}

/** Gabarit racine du site public (barre du haut, header, footer, panier). L'admin a le sien. */
export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} className={fontClasses}>
      <body className="min-h-full flex flex-col">
        <SiteShell lang={lang}>{children}</SiteShell>
      </body>
    </html>
  );
}
