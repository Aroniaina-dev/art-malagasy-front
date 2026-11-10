"use client";

import Link from "next/link";
import { useI18n } from "@/app/components/I18nProvider";

/** Filet de sécurité du site public : le header et le footer restent affichés. */
export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  const { d, to } = useI18n();
  return (
    <section className="section auth-wrap">
      <div className="form-done">
        <h3>{d.common.errorTitle}</h3>
        <p>{d.common.errorText}</p>
        <div className="account-actions">
          <button className="btn" onClick={() => reset()}>{d.common.retry}</button>
          <Link className="btn btn-light" href={to("/")}>{d.common.backHome}</Link>
        </div>
      </div>
    </section>
  );
}
