import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession } from "@/lib/session";
import AuthForm from "@/app/components/AuthForm";

export const metadata: Metadata = { title: "Inscription — ArtMadagascar" };

async function RegisterContent({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  const safe = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/compte";
  if (await getSession()) redirect(safe);
  return <AuthForm mode="register" callbackUrl={safe} />;
}

export default function RegisterPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">Mon compte</div>
        <h1>Créer un compte</h1>
      </section>
      <section className="section auth-wrap">
        <Suspense fallback={<p className="no-result">Chargement…</p>}>
          <RegisterContent searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}
