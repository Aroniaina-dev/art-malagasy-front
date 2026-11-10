"use client";

import Link from "next/link";

/** Filet de sécurité du site public : le header et le footer restent affichés. */
export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section auth-wrap">
      <div className="form-done">
        <h3>Oups, un problème est survenu</h3>
        <p>Cette page n&apos;a pas pu se charger. Réessayez dans un instant.</p>
        <div className="account-actions">
          <button className="btn" onClick={() => reset()}>Réessayer</button>
          <Link className="btn btn-light" href="/">Retour à l&apos;accueil</Link>
        </div>
      </div>
    </section>
  );
}
