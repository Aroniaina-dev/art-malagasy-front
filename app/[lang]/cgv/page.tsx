import type { Metadata } from "next";
import LegalPage from "@/app/components/LegalPage";
import { getLang } from "@/lib/i18n";
import { legal } from "@/lib/legal";
import { BRAND } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const doc = legal.cgv[await getLang()];
  return { title: `${doc.title} | ${BRAND}`, description: doc.intro };
}

export default async function CgvPage() {
  return <LegalPage doc={legal.cgv[await getLang()]} />;
}
