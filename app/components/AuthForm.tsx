"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, register } from "../actions/auth";
import type { FormState } from "../actions/contact";

export default function AuthForm({ mode, callbackUrl }: { mode: "login" | "register"; callbackUrl: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(mode === "login" ? login : register, {});
  const isLogin = mode === "login";

  return (
    <form className="contact-form auth-form" action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      {!isLogin && (
        <>
          <div className="form-row">
            <label>Nom<input name="nom" required autoComplete="family-name" /></label>
            <label>Prénom<input name="prenom" required autoComplete="given-name" /></label>
          </div>
          <label>Téléphone (facultatif)<input name="tel" type="tel" autoComplete="tel" /></label>
        </>
      )}
      <label>Email<input name="email" type="email" required autoComplete="email" /></label>
      <label>Mot de passe
        <input name="password" type="password" required minLength={isLogin ? undefined : 8} autoComplete={isLogin ? "current-password" : "new-password"} />
      </label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Patientez…" : isLogin ? "Se connecter" : "Créer mon compte"}
      </button>
      <p className="auth-alt">
        {isLogin ? (
          <>Pas encore de compte ? <Link href={`/inscription?callbackUrl=${encodeURIComponent(callbackUrl)}`}>Inscrivez-vous</Link></>
        ) : (
          <>Déjà un compte ? <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>Connectez-vous</Link></>
        )}
      </p>
    </form>
  );
}
