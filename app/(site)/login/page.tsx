import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession } from "@/lib/session";
import AuthForm from "@/app/components/AuthForm";

export const metadata: Metadata = { title: "Connexion — ArtMadagascar" };

async function LoginContent({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  const safe = callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/compte";
  if (await getSession()) redirect(safe);
  return <AuthForm mode="login" callbackUrl={safe} />;
}

export default function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">Mon compte</div>
        <h1>Connexion</h1>
        <p>Accédez à votre compte.</p>
      </section>
      <section className="section auth-wrap">
        <Suspense fallback={<p className="no-result">Chargement…</p>}>
          <LoginContent searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}
