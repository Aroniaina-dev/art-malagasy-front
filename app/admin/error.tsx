"use client";

import Link from "next/link";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="form-done">
      <h3>Impossible de charger cette page</h3>
      <p>L&apos;API ne répond pas ou a renvoyé une erreur{error.digest ? ` (réf. ${error.digest})` : ""}.</p>
      <div className="account-actions">
        <button className="btn" onClick={() => reset()}>Réessayer</button>
        <Link className="btn btn-light" href="/admin">Tableau de bord</Link>
      </div>
    </div>
  );
}
