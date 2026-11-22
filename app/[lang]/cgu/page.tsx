import type { Metadata } from "next";
import LegalPage from "@/app/components/LegalPage";
import { getLang } from "@/lib/i18n";
import { legal } from "@/lib/legal";
import { BRAND } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const doc = legal.cgu[await getLang()];
  return { title: `${doc.title} | ${BRAND}`, description: doc.intro };
}

export default async function CguPage() {
  return <LegalPage doc={legal.cgu[await getLang()]} />;
}
