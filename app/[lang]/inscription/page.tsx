import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AuthForm from "@/app/components/AuthForm";
import { getI18n } from "@/lib/i18n";
import { getSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { d } = await getI18n();
  return { title: d.auth.registerMeta };
}

type Search = Promise<{ callbackUrl?: string }>;

async function RegisterContent({ searchParams }: { searchParams: Search }) {
  const { lang } = await getI18n();
  const { callbackUrl } = await searchParams;
  const safe = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : `/${lang}/compte`;
  if (await getSession()) redirect(safe);
  return <AuthForm mode="register" callbackUrl={safe} />;
}

export default async function RegisterPage({ searchParams }: { searchParams: Search }) {
  const { d } = await getI18n();
  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">{d.auth.eyebrow}</div>
        <h1>{d.auth.registerTitle}</h1>
      </section>
      <section className="section auth-wrap">
        <Suspense fallback={<p className="no-result">{d.common.loading}</p>}>
          <RegisterContent searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}
